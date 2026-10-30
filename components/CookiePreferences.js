"use client";
import { useEffect, useState } from "react";
export default function CookiePreferences() {
  const [open, setOpen] = useState(false),
    [choice, setChoice] = useState("");
  useEffect(() => {
    const value = document.cookie
      .split("; ")
      .find((x) => x.startsWith("lrt_cookie_consent="))
      ?.split("=")[1];
    setChoice(value || "");
    const version = document.cookie
      .split("; ")
      .find((x) => x.startsWith("lrt_consent_version="))
      ?.split("=")[1];
    setOpen(!["essential", "all"].includes(value) || version !== "2");
    const reopen = () => setOpen(true);
    window.addEventListener("lrt:open-consent", reopen);
    return () => window.removeEventListener("lrt:open-consent", reopen);
  }, []);
  function save(value) {
    document.cookie = `lrt_cookie_consent=${value}; Path=/; Max-Age=15552000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    document.cookie = `lrt_consent_version=2; Path=/; Max-Age=15552000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    setChoice(value);
    setOpen(false);
    window.dispatchEvent(
      new CustomEvent("lrt:consent", { detail: { optional: value === "all" } }),
    );
  }
  return (
    <>
      {open && (
        <section className="cookie-banner" aria-label="Cookie preferences">
          <div>
            <h2>Your privacy, your choice.</h2>
            <p>
              We use essential cookies and local storage to remember your
              shopping region, bag and preferences. Optional analytics or
              marketing may only be enabled with your consent. No optional
              trackers are currently installed.{" "}
              <a href="/privacy">Privacy policy</a>
            </p>
            {choice && (
              <small>
                Current choice:{" "}
                {choice === "all" ? "All cookies allowed" : "Essential only"}.
              </small>
            )}
          </div>
          <div className="cookie-actions">
            <button onClick={() => save("essential")}>Essential only</button>
            <button onClick={() => save("all")}>Accept all</button>
          </div>
        </section>
      )}
    </>
  );
}
