"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { contact, contactoPage, socials } from "@/data/site";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import SplitTitle from "@/components/ui/SplitTitle";

type Mode = "driving" | "transit" | "walking";
type Status = "idle" | "locating" | "ready" | "denied" | "unsupported";
type Origin = { lat: number; lng: number };

const MODES: { id: Mode; label: string; flag: string }[] = [
  { id: "driving", label: "Auto / moto", flag: "d" },
  { id: "transit", label: "Transporte público", flag: "r" },
  { id: "walking", label: "A pie", flag: "w" },
];

const STATUS_TEXT: Record<Status, string> = {
  idle: "Toca “Trazar mi ruta” y te mostramos el camino desde donde estás.",
  locating: "Buscando tu ubicación…",
  ready:
    "Ruta trazada desde tu ubicación. Para la navegación paso a paso, ábrela en Google Maps.",
  denied:
    "No pudimos acceder a tu ubicación. Permite el acceso en tu navegador o abre la ruta directo en Google Maps.",
  unsupported:
    "Tu navegador no permite ubicarte. Abre la ruta directo en Google Maps.",
};

const destination = `${contact.lat},${contact.lng}`;

/** Mapa con la ruta dibujada dentro de la pagina */
function embedRoute(origin: Origin, flag: string) {
  return `https://maps.google.com/maps?saddr=${origin.lat},${origin.lng}&daddr=${destination}&dirflg=${flag}&hl=es&output=embed`;
}

/** Navegacion paso a paso en Google Maps (usa tu ubicacion si no se indica) */
function googleRoute(mode: Mode, origin: Origin | null) {
  const from = origin ? `&origin=${origin.lat},${origin.lng}` : "";
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=${mode}${from}`;
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-white/15 py-4">
      <dt className="mb-1 font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
        {label}
      </dt>
      <dd className="text-lg text-white">{children}</dd>
    </div>
  );
}

/** Datos de contacto + ruta guiada + mapa con marco dorado y ondas. */
export default function ContactoMap() {
  const [mode, setMode] = useState<Mode>("driving");
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOrigin({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus("ready");
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }, []);

  // El boton "Como llegar" de la barra llega con #ruta: traza la ruta sola
  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#ruta") locate();
    };
    const timer = window.setTimeout(check, 0);
    window.addEventListener("hashchange", check);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", check);
    };
  }, [locate]);

  const flag = MODES.find((item) => item.id === mode)?.flag ?? "d";
  const mapSrc = origin ? embedRoute(origin, flag) : contact.mapsEmbed;

  const resetRoute = () => {
    setOrigin(null);
    setStatus("idle");
  };

  return (
    <section id="ruta" className="relative bg-night-900 py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:px-12">
        {/* Informacion y controles de ruta */}
        <div>
          <SplitTitle
            text={contactoPage.title}
            className="font-display text-5xl font-bold uppercase leading-none text-white md:text-6xl"
          />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md font-serif text-xl leading-relaxed text-white/75">
              {contactoPage.text}
            </p>

            {/* ---- Ruta guiada ---- */}
            <div className="mt-8 border border-gold-400/40 p-5">
              <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
                ¿Cómo vas a llegar?
              </p>

              <div className="flex flex-wrap gap-2" role="group" aria-label="Medio de transporte">
                {MODES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={mode === item.id}
                    onClick={() => setMode(item.id)}
                    className={`border px-4 py-2 font-display text-sm font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
                      mode === item.id
                        ? "border-gold-400 bg-gold-400 text-night-950"
                        : "border-white/30 text-white hover:border-gold-400"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={locate}
                  disabled={status === "locating"}
                  className="inline-flex items-center justify-center gap-3 bg-gold-400 px-7 py-3.5 font-display text-base font-bold uppercase tracking-[0.12em] text-night-950 transition-colors duration-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 disabled:opacity-60"
                >
                  {status === "locating" ? "Ubicándote…" : "Trazar mi ruta"}
                </button>
                {origin && (
                  <button
                    type="button"
                    onClick={resetRoute}
                    className="border border-white/40 px-5 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-gold-400 hover:text-gold-400"
                  >
                    Ver solo la ubicación
                  </button>
                )}
              </div>

              <p role="status" className="mt-4 text-sm leading-relaxed text-white/70">
                {STATUS_TEXT[status]}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Button href={googleRoute(mode, origin)} variant="outline" external>
                  Google Maps
                </Button>
                <Button href={contact.wazeUrl} variant="outline" external>
                  Waze
                </Button>
              </div>
            </div>

            {/* ---- Datos ---- */}
            <dl className="mt-8">
              <InfoRow label="Ubicación">
                {contact.city}
                {contact.address && (
                  <span className="mt-1 block text-base text-white/70">
                    {contact.address}
                  </span>
                )}
              </InfoRow>
              {contact.schedule && (
                <InfoRow label="Horarios">{contact.schedule}</InfoRow>
              )}
              {contact.phone && (
                <InfoRow label="Teléfono">
                  <a
                    href={`tel:${contact.phoneHref}`}
                    className="transition-colors hover:text-gold-400"
                  >
                    {contact.phone}
                  </a>
                </InfoRow>
              )}
              {contact.whatsapp && (
                <InfoRow label="WhatsApp">
                  <a
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-gold-400"
                  >
                    Escríbenos al {contact.phone}
                  </a>
                </InfoRow>
              )}
              {contact.email && (
                <InfoRow label="Correo">
                  <a
                    href={`mailto:${contact.email}`}
                    className="break-all transition-colors hover:text-gold-400"
                  >
                    {contact.email}
                  </a>
                </InfoRow>
              )}
              <InfoRow label="Redes">
                <span className="flex flex-wrap gap-x-6 gap-y-1">
                  {socials
                    .filter((social) => social.name !== "WhatsApp")
                    .map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-gold-400"
                      >
                        {social.name}
                      </a>
                    ))}
                </span>
              </InfoRow>
            </dl>
          </Reveal>
        </div>

        {/* Mapa */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          className="relative aspect-[4/3] w-full lg:sticky lg:top-28 lg:aspect-auto lg:h-[min(640px,calc(100svh-9rem))] lg:self-start"
        >
          <motion.div
            variants={{
              hidden: { clipPath: "inset(0 100% 0 0)" },
              visible: {
                clipPath: "inset(0 0% 0 0)",
                transition: { duration: 1.3, ease: [0.76, 0, 0.24, 1] },
              },
            }}
            className="map-frame absolute inset-0 border border-gold-400/50 bg-night-800"
          >
            <iframe
              key={mapSrc}
              title={
                origin
                  ? "Ruta hasta la Torre 4000 en Google Maps"
                  : "Ubicación de Torre 4000 en Google Maps"
              }
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />

            {/* Ondas cuadradas en el punto central (solo sin ruta) */}
            {!origin && (
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0"
              >
                {[0, 1, 2].map((ring) => (
                  <motion.span
                    key={ring}
                    className="absolute -left-10 -top-10 block h-20 w-20 border border-gold-400"
                    initial={{ scale: 0.3, opacity: 0.7, rotate: 45 }}
                    animate={{ scale: 3.2, opacity: 0, rotate: 45 }}
                    transition={{
                      duration: 3.2,
                      delay: ring * 1,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Esquinas doradas */}
            {[
              "left-0 top-0 border-l-2 border-t-2",
              "right-0 top-0 border-r-2 border-t-2",
              "bottom-0 left-0 border-b-2 border-l-2",
              "bottom-0 right-0 border-b-2 border-r-2",
            ].map((position) => (
              <span
                key={position}
                aria-hidden
                className={`pointer-events-none absolute h-8 w-8 border-gold-400 ${position}`}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}