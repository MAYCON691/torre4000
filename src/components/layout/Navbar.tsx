"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { ctaLink, navLinks } from "@/data/site";
import { useScrollY } from "@/hooks/useScrollY";
import Button from "@/components/ui/Button";
import MobileMenu from "@/components/layout/MobileMenu";
import ScrollProgress from "@/components/layout/ScrollProgress";

export default function Navbar() {
  const pathname = usePathname();
  const scrollY = useScrollY();
  const [open, setOpen] = useState(false);
  const scrolled = scrollY > 24;

  const closeMenu = useCallback(() => setOpen(false), []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Arriba: negro transparente. Al hacer scroll: negro solido */}
      <motion.header
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`force-dark fixed inset-x-0 top-0 z-50 h-[72px] transition-colors duration-300 lg:h-[88px] ${
          scrolled
            ? "bg-black shadow-lg shadow-black/50"
            : "bg-black/40 backdrop-blur-[3px]"
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-5 lg:px-12">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Torre 4000 - Inicio"
            className="shrink-0 transition-transform duration-300 hover:scale-105"
          >
            <Image
              src="/images/logo.png"
              alt="Torre 4000"
              width={140}
              height={70}
              priority
              className="h-11 w-auto lg:h-14"
            />
          </Link>

          {/* Menu escritorio: cada opcion es una pagina */}
          <nav aria-label="Principal" className="hidden items-center gap-7 xl:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link group relative py-2 font-display text-[17px] font-medium uppercase tracking-wide ${
                    active ? "text-gold-400" : "text-white/90 hover:text-gold-400"
                  }`}
                >
                  {link.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-gold-400"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : (
                    <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-gold-400/70 transition-transform duration-300 group-hover:scale-x-100" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Derecha escritorio: boton principal */}
          <div className="hidden items-center gap-4 xl:flex">
            <Button href={ctaLink.href} variant="light" external>
              {ctaLink.label}
            </Button>
          </div>

          {/* Derecha movil: hamburguesa */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              type="button"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="relative z-[60] flex h-11 w-11 items-center justify-center"
            >
              <span
                className={`absolute h-0.5 w-6 bg-white transition-transform duration-300 ${
                  open ? "rotate-45" : "-translate-y-2"
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 bg-white transition-opacity duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 bg-white transition-transform duration-300 ${
                  open ? "-rotate-45" : "translate-y-2"
                }`}
              />
            </button>
          </div>
        </div>

        <ScrollProgress />
      </motion.header>

      {/* Fuera del header: el backdrop-blur rompe los elementos fixed hijos */}
      <MobileMenu open={open} onClose={closeMenu} pathname={pathname} />
    </>
  );
}