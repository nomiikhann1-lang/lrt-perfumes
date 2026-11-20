import styles from "./SocialLinks.module.css";

export const socialProfiles = [
  { name: "Instagram", href: "https://www.instagram.com/lrt_perfumes/" },
  { name: "TikTok", href: "https://www.tiktok.com/@lrt_perfume" },
  { name: "Facebook", href: "https://facebook.com/lrtperfumes" },
];

export function WhatsAppIcon({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M20.4 3.6A10 10 0 0 0 4.7 15.7L3 22l6.4-1.7A10 10 0 0 0 20.4 3.6Z" />
      <path d="M8.2 6.7c-.4 0-.8.2-1 .6-.8 1.4.1 3.7 2.1 5.7 2 2 4.4 3.1 5.9 2.3.4-.2.8-.9.9-1.4 0-.3-.1-.4-.4-.6l-2-1c-.3-.1-.5-.1-.7.2l-.7.8c-.2.2-.4.2-.7.1a8.3 8.3 0 0 1-3-2.7c-.1-.2-.1-.4.1-.6l.6-.8c.2-.2.2-.4.1-.7l-.9-1.9c-.1-.2-.2-.2-.5-.2Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function SocialLinks() {
  return (
    <nav className={styles.links} aria-label="LRT social media">
      {socialProfiles.map(({ name, href }) => (
        <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name} (opens in a new tab)`} title={name}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {name === "Instagram" ? (
              <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></>
            ) : name === "TikTok" ? (
              <path d="M14 3h3a5 5 0 0 0 4 4v3a8 8 0 0 1-4-1v7a6 6 0 1 1-7-5.9v3.1A3 3 0 1 0 14 16Z" />
            ) : (
              <path d="M14 21v-8h3l.5-3H14V8c0-1 .5-2 2-2h2V3h-3c-3 0-5 2-5 5v2H7v3h3v8" />
            )}
          </svg>
        </a>
      ))}
    </nav>
  );
}
