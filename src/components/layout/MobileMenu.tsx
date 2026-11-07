"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useEffect } from "react";
import { ctaLink, navLinks } from "@/data/site";
import Button from "@/components/ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  pathname: string;
};

export default function MobileMenu({ open, onClose, pathname }: Props) {
  // Bloquea el scroll del fondo y permite cerrar con Escape
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div
      aria-hidden={!open}
      className={`force-dark fixed inset-0 z-[45] flex flex-col bg-black/95 px-6 pb-10 pt-[100px] backdrop-blur-xl transition-all duration-300 xl:hidden ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <nav aria-label="Menú móvil" className="flex flex-1 flex-col justify-center gap-1">
        {navLinks.map((link, index) => (
          <motion.div
            key={link.id}
            initial={false}
            animate={open ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.5, delay: open ? 0.08 * index : 0 }}
          >
            <Link
              href={link.href}
              onClick={onClose}
              className={`block border-b border-white/10 py-3 font-display text-3xl font-bold uppercase tracking-wide transition-colors ${
                isActive(link.href) ? "text-gold-400" : "text-white hover:text-gold-400"
              }`}
            >
              {link.label}
            </Link>
          </motion.div>
        ))}
      </nav>

      <Button href={ctaLink.href} variant="gold" external onClick={onClose} className="w-full">
        {ctaLink.label}
      </Button>
    </div>
  );
}