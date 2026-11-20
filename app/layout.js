export const dynamic = "force-dynamic";
import "./globals.css";
import "./refinements.css";
import "./storefront-v12.css";
import "./scent-slider.css";
import "./scent-backdrop.css";
import "./theme.css";
import CookiePreferences from "../components/CookiePreferences";
import { siteUrl, canIndex, JsonLd } from "../lib/seo";
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LRT Perfumes | Perfumes in Qatar & UAE",
    template: "%s | LRT Perfumes",
  },
  description:
    "Discover signature and inspired perfumes by LRT Perfumes. Shop by scent family, explore 50 ml, 100 ml and 200 ml bottles, and visit our Qatar and Dubai stores.",
  robots: { index: canIndex, follow: true },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "LRT Perfumes",
            url: siteUrl,
            logo: siteUrl + "/logo.png",
            telephone: "+97430100850",
          }}
        />
        {children}
        <CookiePreferences />
      </body>
    </html>
  );
}
