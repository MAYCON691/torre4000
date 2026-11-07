"use client";

import { motion } from "motion/react";
import { socials, type Social } from "@/data/site";

function SocialIcon({ name }: { name: Social["name"] }) {
  if (name === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.4H7.6V13h2.8v8h3.1z" />
      </svg>
    );
  }
  if (name === "WhatsApp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15L2 22l5.1-1.5A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 1 1-4.2 15l-.3-.2-3 .9.9-2.9-.2-.3A8.1 8.1 0 0 1 12.04 3.8zM8.9 7.5c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9 2.2.9 2.6.7 3.1.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.6-.8c-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.7-.7-1.2-1.5-1.3-1.7-.1-.3 0-.4.1-.5l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M16.6 3c.3 2.3 1.6 3.7 3.9 3.9v3c-1.4.1-2.7-.3-3.9-1.1v5.6c0 3.6-2.6 5.6-5.4 5.6-3 0-5.3-2.3-5.3-5.2 0-3.2 2.7-5.5 6-5v3.1c-1.6-.4-2.9.5-2.9 1.9 0 1.1.9 2 2 2 1.2 0 2.1-.8 2.1-2.3V3h3.5z" />
    </svg>
  );
}

export default function FloatingSocials() {
  return (
    <aside
      aria-label="Redes sociales"
      className="fixed bottom-4 right-0 z-40 flex flex-col gap-2"
    >
      {socials.map((social, index) => (
        <motion.a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${social.name} ${social.handle}`}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 1.6 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="group flex items-center gap-3 border border-r-0 border-white/15 bg-black/80 py-2 pl-2 pr-2 text-white backdrop-blur transition-colors duration-300 hover:border-gold-400 hover:bg-black sm:pr-5"
        >
          <span className="flex h-9 w-9 items-center justify-center bg-white/10 transition-colors duration-300 group-hover:bg-gold-400 group-hover:text-night-950">
            <SocialIcon name={social.name} />
          </span>
          <span className="hidden font-body text-sm font-medium sm:inline">
            {social.handle}
          </span>
        </motion.a>
      ))}
    </aside>
  );
}