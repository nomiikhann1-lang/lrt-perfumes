import styles from "./SocialLinks.module.css";

export const socialProfiles = [
  { name: "Instagram", href: "https://www.instagram.com/lrt_perfumes/" },
  { name: "TikTok", href: "https://www.tiktok.com/@lrt_perfume" },
  { name: "Facebook", href: "https://facebook.com/lrtperfumes" },
  { name: "WhatsApp", href: "https://wa.me/97430100850" },
];

export function WhatsAppIcon({ size = 20, ...props }) {
  return (
    <img src="/whatsapp-icon.svg" width={size} height={size} alt="" aria-hidden="true" style={{ flexShrink: 0, objectFit: "contain" }} {...props} />
  );
}

export default function SocialLinks() {
  return (
    <nav className={styles.links} aria-label="LRT social media">
      {socialProfiles.map(({ name, href }) => (
        <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name} (opens in a new tab)`} title={name}>
          <img src={`/${name.toLowerCase()}-icon.svg`} width="23" height="23" alt="" />

        </a>
      ))}
    </nav>
  );
}
