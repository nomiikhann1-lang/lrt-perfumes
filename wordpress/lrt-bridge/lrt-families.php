<?php
/** The product editor, CSV and signed catalogue share one scent family. */
if (!defined("ABSPATH")) {
    exit();
}

function lrt_family_names()
{
    return [
        "Leather",
        "Aromatic",
        "Amber",
        "Sweet",
        "Fruity",
        "Fresh",
        "Citrus",
        "Spicy",
        "Floral",
        "Woody"
    ];
}

function lrt_family_name($value)
{
    if (!is_string($value)) {
        return "";
    }
    $value = strtolower(trim($value));
    $aliases = [
        "flowery" => "Floral",
        "earthy" => "Woody",
        "oud" => "Woody",
        "herbal" => "Aromatic",
        "warm" => "Amber",
        "gourmand" => "Sweet"
    ];
    foreach (lrt_family_names() as $name) {
        if (strtolower($name) === $value) {
            return $name;
        }
    }
    return $aliases[$value] ?? "";
}

function lrt_product_family($data)
{
    return lrt_family_name($data["scentFamily"] ?? "") ?:
        lrt_family_name($data["family"] ?? "");
}

function lrt_family_color($family)
{
    $colors = [
        "Leather" => "#BC5F28",
        "Aromatic" => "#4BBB0F",
        "Amber" => "#FDB813",
        "Sweet" => "#FE9EC4",
        "Fruity" => "#FE9004",
        "Fresh" => "#03E6F5",
        "Citrus" => "#FEE703",
        "Spicy" => "#FA2423",
        "Floral" => "#A153DA",
        "Woody" => "#E9B199"
    ];
    return $colors[lrt_family_name($family)] ?? "#c7b294";
}
