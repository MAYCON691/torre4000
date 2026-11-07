import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "light" | "gold" | "outline";

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** Abre en una pestana nueva (se ignora si el enlace es una ruta interna) */
  external?: boolean;
  onClick?: () => void;
};

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden px-7 py-3.5 font-display text-base font-bold uppercase tracking-[0.12em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400";

const variants: Record<Variant, { box: string; sweep: string }> = {
  light: {
    box: "bg-white text-night-900",
    sweep: "bg-gold-400",
  },
  gold: {
    box: "bg-gold-400 text-night-950",
    sweep: "bg-white",
  },
  outline: {
    box: "border border-white/60 text-white hover:text-night-900",
    sweep: "bg-white",
  },
};

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export default function Button({
  href,
  children,
  variant = "light",
  className = "",
  external = false,
  onClick,
}: Props) {
  const style = variants[variant];
  const classes = `${base} ${style.box} ${className}`;
  const isInternal = href.startsWith("/");

  const content = (
    <>
      <span
        aria-hidden
        className={`absolute inset-0 -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-0 ${style.sweep}`}
      />
      <span className="relative z-10 flex items-center gap-3">
        {children}
        <Arrow />
      </span>
    </>
  );

  if (external && !isInternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={classes}>
      {content}
    </Link>
  );
}