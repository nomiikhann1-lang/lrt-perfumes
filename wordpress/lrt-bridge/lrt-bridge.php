<?php
/**
 * Plugin Name: LRT Perfumes Headless Commerce Bridge
 * Description: Signed catalog and checkout API for the LRT Perfumes Next.js storefront, with a sample catalog importer.
 * Version: 2.8.0
 * Requires PHP: 8.1
 * Requires Plugins: woocommerce
 */
if (!defined("ABSPATH")) {
    exit();
}
require_once __DIR__ . "/lrt-families.php";
function lrt_data($p)
{
    $d = $p->get_meta("_lrt_data");
    if (!is_array($d)) {
        $d = $p->get_meta("_" . "no" . "or" . "_data");
    }
    if (!is_array($d) || !$d) {
        return [];
    }
    $d["color"] = lrt_family_color(lrt_product_family($d));
    return $d;
}
function lrt_number($value)
{
    return is_numeric($value) &&
        is_finite((float) $value) &&
        (float) $value >= 0
        ? (float) $value
        : null;
}
function lrt_variant($p, $size)
{
    if ($p->is_type("variable")) {
        foreach ($p->get_children() as $id) {
            $v = wc_get_product($id);
            if (!$v || !$v->variation_is_visible()) {
                continue;
            }
            $attrs = $v->get_attributes();
            $label = $attrs["pa_size"] ?? ($attrs["size"] ?? "");
            if ((int) preg_replace("/[^0-9]/", "", $label) === $size) {
                return $v;
            }
        }
        return null;
    }
    return $p;
}
function lrt_sizes($p)
{
    if (!$p->is_type("variable")) {
        $d = lrt_data($p);
        return array_values(
            array_filter(
                array_map("intval", $d["sizes"] ?? [50, 100, 200]),
                fn($n) => $n > 0 && $n <= 2000
            )
        );
    }
    $sizes = [];
    foreach ($p->get_children() as $id) {
        $v = wc_get_product($id);
        if (!$v || !$v->variation_is_visible()) {
            continue;
        }
        $a = $v->get_attributes();
        $n = (int) preg_replace(
            "/[^0-9]/",
            "",
            $a["pa_size"] ?? ($a["size"] ?? "")
        );
        if ($n > 0 && $n <= 2000) {
            $sizes[] = $n;
        }
    }
    sort($sizes);
    return array_values(array_unique($sizes));
}
function lrt_variants($p)
{
    $d = lrt_data($p);
    $out = [];
    foreach (lrt_sizes($p) as $size) {
        $v = lrt_variant($p, $size);
        if (!$v) {
            continue;
        }
        $prices = [];
        foreach (["AED", "QAR"] as $currency) {
            $raw = $p->is_type("variable")
                ? $v->get_meta("_lrt_price_" . $currency)
                : $d["prices"][$currency][$size] ?? null;
            $prices[$currency] = lrt_number($raw);
        }
        $out[] = [
            "size" => $size,
            "sku" => $v->get_sku(),
            "variationId" => $v->is_type("variation") ? $v->get_id() : null,
            "stock" => $v->is_in_stock()
                ? ($v->managing_stock()
                    ? (int) $v->get_stock_quantity()
                    : 99)
                : 0,
            "prices" => $prices,
            "image" =>
                wp_get_attachment_image_url($v->get_image_id(), "large") ?: ""
        ];
    }
    return $out;
}
function lrt_auth(WP_REST_Request $r)
{
    if (strlen($r->get_body()) > 16000) {
        return new WP_Error("size", "Request too large.", ["status" => 413]);
    }
    if (!defined("LRT_API_SECRET") || strlen(LRT_API_SECRET) < 32) {
        return new WP_Error(
            "not_configured",
            "Set LRT_API_SECRET (32+ characters) in wp-config.php.",
            ["status" => 503]
        );
    }
    $time = $r->get_header("X-Lrt-Time");
    $signature = $r->get_header("X-Lrt-Signature");
    if (
        !is_string($signature) ||
        !preg_match('/^[a-f0-9]{64}$/', $signature) ||
        strlen((string) $time) > 12 ||
        !ctype_digit((string) $time) ||
        abs(time() - (int) $time) > 300
    ) {
        return new WP_Error("unauthorized", "Invalid request.", [
            "status" => 401
        ]);
    }
    $path = substr($r->get_route(), strlen("/lrt/v1/"));
    $expected = hash_hmac(
        "sha256",
        $time . "\n" . $r->get_method() . "\n" . $path . "\n" . $r->get_body(),
        LRT_API_SECRET
    );
    return hash_equals($expected, (string) $signature)
        ? true
        : new WP_Error("unauthorized", "Invalid request.", ["status" => 401]);
}
add_action("rest_api_init", function () {
    register_rest_route("lrt/v1", "/products", [
        "methods" => "GET",
        "callback" => "lrt_products",
        "permission_callback" => "lrt_auth"
    ]);
    register_rest_route("lrt/v1", "/checkout", [
        "methods" => "POST",
        "callback" => "lrt_checkout",
        "permission_callback" => "lrt_auth"
    ]);
});
function lrt_products(WP_REST_Request $r)
{
    if (!class_exists("WooCommerce")) {
        return new WP_Error("unavailable", "Activate WooCommerce.", [
            "status" => 503
        ]);
    }
    $page = filter_var($r->get_param("page") ?? 1, FILTER_VALIDATE_INT);
    if (!$page || $page < 1 || $page > 20) {
        return new WP_Error("pagination", "Invalid catalogue page.", [
            "status" => 400
        ]);
    }
    $out = [];
    $result = wc_get_products([
        "limit" => 100,
        "page" => $page,
        "paginate" => true,
        "orderby" => "ID",
        "order" => "ASC",
        "status" => "publish",
        "meta_query" => [
            "relation" => "OR",
            ["key" => "_lrt_data", "compare" => "EXISTS"],
            ["key" => "_" . "no" . "or" . "_data", "compare" => "EXISTS"]
        ]
    ]);
    foreach ($result->products as $p) {
        $stored = lrt_data($p);
        if (!$stored) {
            continue;
        }
        $stored["scentFamily"] = lrt_product_family($stored);
        unset($stored["family"]);
        $data = array_intersect_key(
            $stored,
            array_flip([
                "brand",
                "collection",
                "family",
                "scentFamily",
                "gender",
                "color",
                "tag",
                "occasion",
                "season",
                "concentration",
                "ingredients",
                "care",
                "notes"
            ])
        );
        $data["id"] = $p->get_id();
        $data["name"] = $p->get_name();
        $data["sku"] = $p->get_sku();
        $data["slug"] = $p->get_slug();
        $data["description"] = wp_strip_all_tags($p->get_description());
        $data["price"] = (float) $p->get_price();
        $data["stock"] = $p->is_in_stock()
            ? ($p->managing_stock()
                ? (int) $p->get_stock_quantity()
                : 99)
            : 0;
        $data["independentVariationStock"] =
            $p->is_type("variable") && !$p->managing_stock();
        $data["variants"] = lrt_variants($p);
        $data["sizes"] = array_column($data["variants"], "size");
        $data["pricingVersion"] = 2;
        $data["image"] =
            wp_get_attachment_image_url($p->get_image_id(), "large") ?: "";
        $terms = wp_get_post_terms($p->get_id(), "product_cat");
        $data["categories"] = is_wp_error($terms)
            ? []
            : array_map(
                fn($term) => ["name" => $term->name, "slug" => $term->slug],
                $terms
            );
        $data["images"] = array_values(
            array_filter(
                array_map(
                    fn($id) => wp_get_attachment_image_url($id, "large"),
                    array_merge(
                        [$p->get_image_id()],
                        $p->get_gallery_image_ids()
                    )
                )
            )
        );
        $out[] = $data;
    }
    return ["products" => $out, "totalPages" => (int) $result->max_num_pages];
}
function lrt_cities()
{
    return [
        "AE" => [
            "Dubai",
            "Abu Dhabi",
            "Sharjah",
            "Ajman",
            "Ras Al Khaimah",
            "Fujairah",
            "Umm Al Quwain"
        ],
        "QA" => ["Doha", "Al Rayyan", "Lusail", "Al Wakrah", "Al Khor"]
    ];
}
function lrt_checkout(WP_REST_Request $r)
{
    if (!class_exists("WooCommerce")) {
        return new WP_Error("unavailable", "Activate WooCommerce.", [
            "status" => 503
        ]);
    }

    $b = $r->get_json_params();
    if (!is_array($b)) {
        return new WP_Error("invalid", "Invalid request body.", [
            "status" => 400
        ]);
    }
    if (strlen($r->get_body()) > 16000) {
        return new WP_Error("size", "Request too large.", ["status" => 413]);
    }
    if (($b["terms"] ?? "") !== "on") {
        return new WP_Error("terms", "Accept terms before checkout.", [
            "status" => 400
        ]);
    }
    $country = $b["country"] ?? "";
    $city = $b["city"] ?? "";
    $method = $b["payment"] ?? "";
    $key = $b["requestId"] ?? "";
    if (!is_string($key) || !preg_match('/^[a-zA-Z0-9-]{10,80}$/', $key)) {
        return new WP_Error("invalid", "Invalid checkout reference.", [
            "status" => 400
        ]);
    }
    if (
        !is_string($country) ||
        !is_string($city) ||
        !isset(lrt_cities()[$country]) ||
        !in_array($city, lrt_cities()[$country], true)
    ) {
        return new WP_Error("invalid", "Unsupported delivery city.", [
            "status" => 400
        ]);
    }
    if (
        !is_string($method) ||
        !in_array($method, ["cod", "card"], true) ||
        !is_string($b["email"] ?? null) ||
        strlen($b["email"]) > 200 ||
        !is_email($b["email"])
    ) {
        return new WP_Error("invalid", "Invalid checkout details.", [
            "status" => 400
        ]);
    }
    foreach (["firstName", "lastName", "phone", "address"] as $field) {
        if (
            !is_string($b[$field] ?? null) ||
            strlen(trim($b[$field])) < 2 ||
            strlen($b[$field]) > 200
        ) {
            return new WP_Error("invalid", "Complete delivery details.", [
                "status" => 400
            ]);
        }
    }
    if (
        !preg_match('/^[0-9+()\s-]{7,24}$/', $b["phone"]) ||
        (isset($b["note"]) &&
            (!is_string($b["note"]) || strlen($b["note"]) > 2000))
    ) {
        return new WP_Error("invalid", "Invalid contact details.", [
            "status" => 400
        ]);
    }
    $items = $b["items"] ?? [];
    if (!is_array($items) || count($items) < 1 || count($items) > 30) {
        return new WP_Error("invalid", "Invalid shopping bag.", [
            "status" => 400
        ]);
    }
    $currency = $country === "QA" ? "QAR" : "AED";
    if (($b["currency"] ?? "") !== $currency) {
        return new WP_Error(
            "currency",
            "Currency must match the selected country.",
            ["status" => 409]
        );
    }
    $hash = hash("sha256", wp_json_encode($b));
    $opt = "lrt_order_" . hash("sha256", $key);
    $existing = get_option($opt);
    if ($existing) {
        if (($existing["hash"] ?? "") !== $hash) {
            return new WP_Error(
                "conflict",
                "Checkout reference already used.",
                ["status" => 409]
            );
        }
        if (!empty($existing["id"])) {
            $o = wc_get_order($existing["id"]);
            if ($o) {
                return lrt_order_response($o, $method);
            }
        }
        return new WP_Error(
            "busy",
            "Order is being processed. Wait briefly and retry.",
            ["status" => 409]
        );
    }
    $gateways = WC()->payment_gateways()->payment_gateways();
    if (
        $method === "cod" &&
        (!isset($gateways["cod"]) || $gateways["cod"]->enabled !== "yes")
    ) {
        return new WP_Error(
            "gateway",
            "Enable cash on delivery in WooCommerce Payments.",
            ["status" => 409]
        );
    }
    if ($method === "card") {
        $enabled = array_filter(
            $gateways,
            fn($g) => $g->enabled === "yes" &&
                !in_array($g->id, ["cod", "bacs", "cheque"], true)
        );
        if (!$enabled) {
            return new WP_Error(
                "gateway",
                "Configure and enable a card gateway in WooCommerce first.",
                ["status" => 409]
            );
        }
    }
    $validated = [];
    $counts = [];
    $seen = [];
    $subtotal = 0;
    foreach ($items as $i) {
        if (!is_array($i)) {
            return new WP_Error("invalid", "Invalid shopping bag.", [
                "status" => 400
            ]);
        }
        $id = $i["id"] ?? 0;
        $qty = $i["qty"] ?? 0;
        $size = $i["size"] ?? 0;
        $parent = is_int($id) && $id > 0 ? wc_get_product($id) : null;
        if (
            !is_int($id) ||
            !is_int($qty) ||
            !is_int($size) ||
            $qty < 1 ||
            $qty > 10 ||
            ($size < 1 || $size > 2000) ||
            !$parent ||
            $parent->get_status() !== "publish" ||
            !lrt_data($parent) ||
            isset($seen[$id . ":" . $size])
        ) {
            return new WP_Error("stock", "An item is unavailable or invalid.", [
                "status" => 409
            ]);
        }
        if (!in_array($size, lrt_sizes($parent), true)) {
            return new WP_Error("size", "Size unavailable.", ["status" => 409]);
        }
        $p = lrt_variant($parent, $size);
        if (!$p || !$p->is_purchasable() || !$p->is_in_stock()) {
            return new WP_Error("stock", "The selected size is unavailable.", [
                "status" => 409
            ]);
        }
        $variants = lrt_variants($parent);
        $unit = null;
        foreach ($variants as $v) {
            if ($v["size"] === $size) {
                $unit = $v["prices"][$currency];
            }
        }
        if ($unit === null) {
            return new WP_Error(
                "price",
                "Set the selected size and market price in WooCommerce.",
                ["status" => 409]
            );
        }
        $seen[$id . ":" . $size] = true;
        $stock_id = $p->get_stock_managed_by_id();
        $stock_product = wc_get_product($stock_id);
        $counts[$stock_id] = ($counts[$stock_id] ?? 0) + $qty;
        $available = $stock_product->managing_stock()
            ? (int) $stock_product->get_stock_quantity() -
                wc_get_held_stock_quantity($stock_product)
            : 999;
        if ($counts[$stock_id] > $available) {
            return new WP_Error("stock", "Requested quantity exceeds stock.", [
                "status" => 409
            ]);
        }
        $subtotal += $unit * $qty;
        $validated[] = [$p, $qty, $size, $unit];
    }
    if (!add_option($opt, ["hash" => $hash], "", false)) {
        return new WP_Error(
            "busy",
            "Checkout is already processing. Retry shortly.",
            ["status" => 409]
        );
    }
    $order = null;
    try {
        $order = wc_create_order(["created_via" => "lrt-nextjs"]);
        if (is_wp_error($order)) {
            throw new Exception("Could not create order.");
        }
        $order->set_currency($currency);
        $address = [
            "first_name" => sanitize_text_field($b["firstName"]),
            "last_name" => sanitize_text_field($b["lastName"]),
            "email" => sanitize_email($b["email"]),
            "phone" => sanitize_text_field($b["phone"]),
            "address_1" => sanitize_text_field($b["address"]),
            "city" => $city,
            "country" => $country
        ];
        $order->set_address($address, "billing");
        $order->set_address($address, "shipping");
        foreach ($validated as [$p, $qty, $size, $unit]) {
            $net = wc_get_price_excluding_tax($p, [
                "qty" => $qty,
                "price" => $unit
            ]);
            $item_id = $order->add_product($p, $qty, [
                "subtotal" => $net,
                "total" => $net
            ]);
            $item = $order->get_item($item_id);
            $item->add_meta_data("Size", $size . " ml", true);
            $item->save();
        }
        $shipping = new WC_Order_Item_Shipping();
        $shipping->set_method_title("LRT Perfumes delivery — " . $country);
        $shipping->set_method_id("lrt_flat_rate");
        $shipping->set_total(
            0
        );
        $order->add_item($shipping);
        $order->update_meta_data("_lrt_terms_accepted", gmdate("c"));
        $order->set_customer_note(sanitize_textarea_field($b["note"] ?? ""));
        $order->update_meta_data("_lrt_request", $key);
        $order->calculate_totals();
        $order->save();
        wc_reserve_stock_for_order($order);
        if ($method === "cod") {
            $order->set_payment_method("cod");
            $order->set_payment_method_title("Cash on delivery");
            $order->update_status(
                "on-hold",
                "LRT Perfumes cash on delivery order."
            );
            wc_reduce_stock_levels($order->get_id());
            wc_release_stock_for_order($order);
        } else {
            $order->update_status(
                "pending",
                "Awaiting payment on WooCommerce hosted checkout."
            );
        }
        update_option($opt, ["hash" => $hash, "id" => $order->get_id()], false);
        return lrt_order_response($order, $method);
    } catch (Throwable $e) {
        if ($order instanceof WC_Order) {
            $order->update_status("cancelled", "Checkout preparation failed.");
            wc_release_stock_for_order($order);
        }
        delete_option($opt);
        return new WP_Error(
            "checkout",
            "Order could not be prepared. Please check availability and try again.",
            ["status" => 409]
        );
    }
}
function lrt_order_response($order, $method)
{
    $result = [
        "id" => $order->get_id(),
        "total" => (float) $order->get_total(),
        "currency" => $order->get_currency(),
        "mode" => "wordpress",
        "status" => $order->get_status()
    ];
    if ($method === "card" && $order->needs_payment()) {
        $result["paymentUrl"] = $order->get_checkout_payment_url();
    }
    return $result;
}
add_action("admin_menu", function () {
    add_submenu_page(
        "woocommerce",
        "LRT Perfumes Storefront",
        "LRT Perfumes Storefront",
        "manage_woocommerce",
        "lrt-storefront",
        "lrt_admin"
    );
});
function lrt_admin()
{
    if (!current_user_can("manage_woocommerce")) {
        return;
    }
    echo '<div class="wrap"><h1>LRT Perfumes Storefront</h1><p>Next.js storefront connection and sample catalog.</p><p>API secret: <strong>' .
        (defined("LRT_API_SECRET") && strlen(LRT_API_SECRET) >= 32
            ? "Configured"
            : "Not configured — add LRT_API_SECRET to wp-config.php") .
        "</strong></p><p>Catalog API: <code>" .
        esc_html(rest_url("lrt/v1/products")) .
        "</code></p><p>Use Products to manage prices, descriptions and stock. Use Orders to manage purchases. Scent metadata and sizes appear in the LRT Perfumes panel on each product.</p>";
    if (isset($_GET["seeded"])) {
        echo '<div class="notice notice-success"><p>Sample catalog imported. Existing LRT Perfumes SKUs were preserved.</p></div>';
    }
    echo '<form method="post" action="' .
        esc_url(admin_url("admin-post.php")) .
        '"><input type="hidden" name="action" value="lrt_seed">';
    wp_nonce_field("lrt_seed");
    submit_button("Import 10 sample fragrances");
    echo "</form><p>Testing only. Enter independent AED and QAR prices for each size, enable COD, and configure a gateway supporting both currencies in test mode. Replace all sample business policies before launch.</p></div>";
}
add_action("admin_post_lrt_seed", function () {
    if (!current_user_can("manage_woocommerce")) {
        wp_die("Unauthorized");
    }
    check_admin_referer("lrt_seed");
    $catalog = json_decode(file_get_contents(__DIR__ . "/catalog.json"), true);
    foreach ($catalog as $data) {
        $sku = "LRT-" . str_pad($data["id"], 3, "0", STR_PAD_LEFT);
        if (
            wc_get_product_id_by_sku($sku) ||
            wc_get_product_id_by_sku(
                strtoupper("no" . "or") .
                    "-" .
                    str_pad($data["id"], 3, "0", STR_PAD_LEFT)
            )
        ) {
            continue;
        }
        $p = new WC_Product_Simple();
        $p->set_name($data["name"]);
        $p->set_slug($data["slug"]);
        $p->set_sku($sku);
        $p->set_description($data["description"]);
        $p->set_regular_price($data["price"]);
        $p->set_manage_stock(true);
        $p->set_stock_quantity($data["stock"]);
        $p->set_status("publish");
        $data["prices"] = [];
        foreach ($data["variants"] as $v) {
            foreach (["AED", "QAR"] as $c) {
                $data["prices"][$c][$v["size"]] = $v["prices"][$c];
            };
        }
        $p->set_regular_price($data["prices"]["QAR"][50] ?? "");
        $data["scentFamily"] = lrt_product_family($data);
        $data["color"] = lrt_family_color($data["scentFamily"]);
        unset($data["family"]);
        $p->update_meta_data("_lrt_data", $data);
        $ids = [];
        foreach ([$data["scentFamily"], $data["gender"]] as $cat) {
            $term = term_exists($cat, "product_cat");
            if (!$term) {
                $term = wp_insert_term($cat, "product_cat");
            }
            if (!is_wp_error($term)) {
                $ids[] = (int) $term["term_id"];
            }
        }
        $p->set_category_ids($ids);
        $p->save();
    }
    wp_safe_redirect(admin_url("admin.php?page=lrt-storefront&seeded=1"));
    exit();
});
add_action("woocommerce_product_options_general_product_data", function () {
    global $product_object;
    if (!$product_object) {
        return;
    }
    $d = lrt_data($product_object);
    if (!$d) {
        $d = [
            "gender" => "Unisex",
            "notes" => ["", "", ""],
            "sizes" => [50, 100, 200]
        ];
    }
    echo '<div class="options_group"><h4 style="padding-left:12px">LRT Perfumes scent details</h4>';
    $families = lrt_family_names();
    woocommerce_wp_select([
        "id" => "lrt_scentFamily",
        "label" => "Scent family",
        "value" => lrt_product_family($d),
        "options" =>
            ["" => "Choose a scent family"] +
            array_combine($families, $families)
    ]);
    foreach (
        [
            "brand" => "Brand (e.g. LRT Perfumes)",
            "collection" => "Collection (LRT Collection / Inspired Edition)",
            "gender" => "Audience",
            "tag" => "Product badge",
            "occasion" => "Occasion",
            "season" => "Season",
            "concentration" => "Concentration"
        ]
        as $k => $label
    ) {
        woocommerce_wp_text_input([
            "id" => "lrt_" . $k,
            "label" => $label,
            "value" => $d[$k] ?? ""
        ]);
    }
    foreach (["Top", "Heart", "Base"] as $i => $label) {
        woocommerce_wp_text_input([
            "id" => "lrt_note_" . $i,
            "label" => $label . " notes",
            "value" => $d["notes"][$i] ?? ""
        ]);
    }
    woocommerce_wp_text_input([
        "id" => "lrt_sizes",
        "label" => "Sizes in ml (comma separated)",
        "value" => implode(", ", $d["sizes"] ?? [50, 100, 200])
    ]);
    foreach (["ingredients", "care"] as $k) {
        woocommerce_wp_textarea_input([
            "id" => "lrt_" . $k,
            "label" => ucfirst($k),
            "value" => $d[$k] ?? ""
        ]);
    }
    echo "</div>";
});
add_action("woocommerce_admin_process_product_object", function ($p) {
    $d = lrt_data($p);
    if (!$d) {
        $d = [
            "gender" => "Unisex",
            "notes" => ["", "", ""],
            "sizes" => [50, 100, 200]
        ];
    }
    if (isset($_POST["lrt_scentFamily"])) {
        $d["scentFamily"] = lrt_family_name(
            wp_unslash($_POST["lrt_scentFamily"])
        );
        unset($d["family"]);
    }
    foreach (
        [
            "brand",
            "collection",
            "gender",
            "tag",
            "occasion",
            "season",
            "concentration",
            "ingredients",
            "care"
        ]
        as $k
    ) {
        if (isset($_POST["lrt_" . $k])) {
            $d[$k] = in_array($k, ["ingredients", "care"], true)
                ? sanitize_textarea_field(wp_unslash($_POST["lrt_" . $k]))
                : sanitize_text_field(wp_unslash($_POST["lrt_" . $k]));
        }
    }
    if (isset($_POST["lrt_notes"])) {
        $notes = array_map(
            "sanitize_text_field",
            explode(",", wp_unslash($_POST["lrt_notes"]))
        );
        $d["notes"] = array_slice(
            array_pad(array_map("trim", $notes), 3, ""),
            0,
            3
        );
    }
    foreach ([0, 1, 2] as $i) {
        if (isset($_POST["lrt_note_" . $i])) {
            $d["notes"][$i] = sanitize_text_field(
                wp_unslash($_POST["lrt_note_" . $i])
            );
        }
    }
    if (isset($_POST["lrt_sizes"])) {
        $sizes = array_values(
            array_filter(
                array_map("intval", explode(",", $_POST["lrt_sizes"])),
                fn($n) => $n > 0 && $n <= 2000
            )
        );
        $d["sizes"] = array_values(array_unique(array_merge([50], $sizes)));
    }
    $d["color"] = lrt_family_color(lrt_product_family($d));
    $p->update_meta_data("_lrt_data", $d);
});

add_action("woocommerce_product_options_general_product_data", function () {
    global $product_object;
    if (!$product_object) {
        return;
    }
    $d = lrt_data($product_object);
    echo '<div class="options_group"><h4 style="padding-left:12px">LRT Perfumes market prices</h4><p style="padding-left:12px">Simple products: enter all six prices. Variable products: use the fields under each size variation instead. Blank means unavailable in that market.</p>';
    foreach (["AED", "QAR"] as $c) {
        foreach ([50, 100, 200] as $size) {
            woocommerce_wp_text_input([
                "id" => "lrt_price_" . $c . "_" . $size,
                "label" => $size . " ml — " . $c,
                "type" => "number",
                "custom_attributes" => ["step" => "0.01", "min" => "0"],
                "value" => $d["prices"][$c][$size] ?? ""
            ]);
        };
    }
    echo "</div>";
});
add_action("woocommerce_admin_process_product_object", function ($p) {
    $d = lrt_data($p);
    if (!$d) {
        return;
    }
    foreach (["AED", "QAR"] as $c) {
        foreach ([50, 100, 200] as $size) {
            $key = "lrt_price_" . $c . "_" . $size;
            if (isset($_POST[$key])) {
                $d["prices"][$c][$size] = lrt_number(
                    wc_clean(wp_unslash($_POST[$key]))
                );
            }
        };
    }
    $d["sizes"] = $d["sizes"] ?? [50, 100, 200];
    if ($p->is_type("simple") && isset($d["prices"]["QAR"])) {
        $p->set_regular_price($d["prices"]["QAR"][50] ?? "");
    }
    $p->update_meta_data("_lrt_data", $d);
});
add_action(
    "woocommerce_product_after_variable_attributes",
    function ($loop, $variation_data, $variation) {
        foreach (["AED", "QAR"] as $c) {
            woocommerce_wp_text_input([
                "id" => "lrt_variation_" . $c . "_" . $variation->ID,
                "name" => "lrt_variation_" . $c . "[" . $variation->ID . "]",
                "label" => "LRT Perfumes price — " . $c,
                "type" => "number",
                "custom_attributes" => ["step" => "0.01", "min" => "0"],
                "value" => get_post_meta(
                    $variation->ID,
                    "_lrt_price_" . $c,
                    true
                )
            ]);
        }
    },
    10,
    3
);
add_action(
    "woocommerce_save_product_variation",
    function ($id) {
        foreach (["AED", "QAR"] as $c) {
            if (!isset($_POST["lrt_variation_" . $c][$id])) {
                continue;
            }
            $raw = $_POST["lrt_variation_" . $c][$id];
            $value = lrt_number(wc_clean(wp_unslash($raw)));
            if ($value === null) {
                delete_post_meta($id, "_lrt_price_" . $c);
            } else {
                update_post_meta($id, "_lrt_price_" . $c, $value);
            }
        }
    },
    10,
    1
);

require_once __DIR__ . "/lrt-csv.php";
