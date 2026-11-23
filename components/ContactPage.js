"use client";

import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import styles from "./ContactPage.module.css";
import SocialLinks, { WhatsAppIcon } from "./SocialLinks";

const email = "info@lrtperfumes.com";
export default function ContactPage() {
  const [emailOpened, setEmailOpened] = useState(false);

  function prepareEmail(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name")).trim();
    const replyTo = String(data.get("email")).trim();
    const message = String(data.get("message")).trim();
    if (!name || !message) {
      const field = event.currentTarget.elements.namedItem(!name ? "name" : "message");
      field.setCustomValidity("Please enter " + (!name ? "your name." : "your message."));
      field.reportValidity();
      return;
    }
    const subject = encodeURIComponent("LRT Perfumes — Enquiry from " + name);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nReply to: ${replyTo}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setEmailOpened(true);
  }

  return (
    <section className={styles.contact} aria-labelledby="contact-title">
      <img className={styles.backdrop} src="/editorial.webp" alt="" fetchPriority="high" />
      <div className={styles.panel}>
        <h1 id="contact-title">Contact us.</h1>
        <p className={styles.intro}>
          A question about your order, a scent, or something else?
          We’d love to hear from you.
        </p>

        <a className={styles.email} href={`mailto:${email}`}>
          <Mail size={20} aria-hidden="true" />
          {email}
        </a>
        <div className={styles.direct}>
          <a href="tel:+97430100850"><Phone size={17} aria-hidden="true" />+974 3010 0850</a>
          <a href="https://wa.me/97430100850" target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={18} />WhatsApp</a>
        </div>

        <form className={styles.form} onSubmit={prepareEmail}>
          <label>
            <span className={styles.visuallyHidden}>Your name (required)</span>
            <input name="name" autoComplete="name" placeholder="Your name *" maxLength={100} required onInput={(event) => event.currentTarget.setCustomValidity("")} />
          </label>
          <label>
            <span className={styles.visuallyHidden}>Your email (required)</span>
            <input name="email" type="email" autoComplete="email" placeholder="Your email *" maxLength={200} required />
          </label>
          <label>
            <span className={styles.visuallyHidden}>Your message (required)</span>
            <textarea name="message" placeholder="How can we help? *" rows={4} maxLength={3000} required onInput={(event) => event.currentTarget.setCustomValidity("")} />
          </label>
          <button type="submit" className={styles.submit}>Send via email</button>
          <p className={styles.note} role="status">
            {emailOpened
              ? "Your email app should open with your message. Send it there, or email us directly above."
              : "Opens your email app with your message ready to send."}
          </p>
        </form>

        <div className={styles.socials}>
          <span>Let’s stay in touch</span>
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}
