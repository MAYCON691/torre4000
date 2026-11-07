"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { contact, navLinks, site, socials } from "@/data/site";
import Reveal from "@/components/ui/Reveal";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const wordX = useTransform(scrollYProgress, [0, 1], ["12%", "-4%"]);

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-white/10 bg-night-950">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 md:grid-cols-3 lg:px-8">
        {/* Marca */}
        <Reveal className="flex flex-col gap-5">
          <Image
            src="/images/logo.png"
            alt="Torre 4000"
            width={140}
            height={70}
            className="h-14 w-auto self-start"
          />
          <p className="max-w-xs font-serif text-xl italic text-white/70">
            {site.footerNote}
          </p>
        </Reveal>

        {/* Navegacion */}
        <Reveal delay={0.1}>
          <nav aria-label="Pie de página">
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.3em] text-gold-400">
              Explora
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="inline-block text-white/70 transition-all duration-300 hover:translate-x-2 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        {/* Contacto y redes */}
        <Reveal delay={0.2}>
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.3em] text-gold-400">
            Contacto
          </h3>
          <ul className="space-y-2 text-white/70">
            <li>{contact.city}</li>
            {contact.address && <li>{contact.address}</li>}
            {contact.phone && (
              <li>
                <a
                  href={`tel:${contact.phoneHref}`}
                  className="transition-colors hover:text-white"
                >
                  {contact.phone}
                </a>
              </li>
            )}
            {contact.email && (
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="break-all transition-colors hover:text-white"
                >
                  {contact.email}
                </a>
              </li>
            )}
            <li>
              <Link
                href="/contacto#ruta"
                className="font-semibold text-gold-400 transition-colors hover:text-white"
              >
                Cómo llegar →
              </Link>
            </li>
          </ul>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {socials.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-sm font-semibold uppercase tracking-widest text-white/80 transition-colors hover:text-gold-400"
                >
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Palabra gigante que se desplaza con el scroll */}
      <motion.p
        aria-hidden
        style={{ x: wordX }}
        className="outline-text pointer-events-none select-none whitespace-nowrap font-display text-[22vw] font-bold uppercase leading-[0.85]"
      >
        Torre 4000
      </motion.p>

      <div className="border-t border-white/10 py-5 text-center text-sm text-white/50">
        © 2026 Torre 4000. Todos los derechos reservados.
      </div>
    </footer>
  );
}