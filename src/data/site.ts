/* ==========================================================================
   TORRE 4000 - Datos del sitio
   Todo el contenido editable vive aqui. Los comentarios TODO marcan lo que
   falta confirmar con datos oficiales (direccion, horarios).
   ========================================================================== */

export type NavLink = { id: string; label: string; href: string };
export type Social = {
  name: "Facebook" | "TikTok" | "WhatsApp";
  handle: string;
  href: string;
};
export type Feature = { title: string; text: string };
export type EventItem = {
  tag: string;
  title: string;
  text: string;
  featured?: boolean;
};
export type Photo = { src: string; alt: string };
export type HomePanel = {
  number: string;
  title: string;
  text: string;
  href: string;
  image: string;
  position: string;
};
export type PageIntro = {
  crumb: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  position: string;
};

/* ------------------------------ Marca / Hero ---------------------------- */
export const site = {
  name: "Torre 4000",
  claim: "El Pico de Bolivia",
  description:
    "Torre 4000, el nuevo ícono de La Paz y El Alto: mirador, restaurante FUEGO 4086 y eventos a gran altura.",
  hero: {
    titleTop: "Torre 4000:",
    titleBottom: "El Pico de Bolivia",
    subtitle: "Conoce el primer rascacielos ecológico de altura",
  },
  footerNote: "Nace un nuevo ícono para La Paz y El Alto.",
};

/* -------------------------------- Contacto ------------------------------ */
// Los campos vacios no se muestran en la web.
// TODO: completar address (direccion) y schedule (horarios) cuando se confirmen.
export const contact = {
  city: "El Alto, La Paz - Bolivia",
  address: "",
  phone: "+591 75859771",
  phoneHref: "+59175859771",
  whatsapp: "59175859771",
  email: "torre4000.elalto@gmail.com",
  schedule: "",
  lat: -16.525057,
  lng: -68.147107,
  mapsUrl: "https://maps.app.goo.gl/trBjgWZhrG3z3pf79",
  mapsEmbed:
    "https://www.google.com/maps?q=-16.525057,-68.147107&z=17&hl=es&output=embed",
  wazeUrl: "https://waze.com/ul?ll=-16.525057,-68.147107&navigate=yes",
};

export const whatsappLink = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
  "Hola, quisiera información sobre Torre 4000.",
)}`;

/* ------------------------------- Navegacion ----------------------------- */
// Cada opcion del menu es una pagina propia.
export const navLinks: NavLink[] = [
  { id: "inicio", label: "Inicio", href: "/" },
  { id: "mirador", label: "Mirador", href: "/mirador" },
  { id: "restaurante", label: "Restaurante", href: "/restaurante" },
  { id: "sostenibilidad", label: "Sostenibilidad", href: "/sostenibilidad" },
  { id: "eventos", label: "Eventos", href: "/eventos" },
  { id: "tour", label: "Tour 360", href: "/tour-360" },
  { id: "contacto", label: "Contacto", href: "/contacto" },
];

// El boton "Como llegar" abre la pagina de contacto y traza la ruta guiada.
export const ctaLink = { label: "Cómo llegar", href: "/contacto#ruta" };

/* --------------------------------- Redes -------------------------------- */
export const socials: Social[] = [
  {
    name: "Facebook",
    handle: "Torre 4000",
    href: "https://www.facebook.com/TORRE4000",
  },
  {
    name: "TikTok",
    handle: "@torre.4000",
    href: "https://www.tiktok.com/@torre.4000",
  },
  { name: "WhatsApp", handle: contact.phone, href: whatsappLink },
];

/* -------------------------------- Fotografias --------------------------- */
// Las fotos van en la carpeta public: fotografia1.jpg ... fotografia5.jpg
export const photos: Photo[] = Array.from({ length: 5 }, (_, index) => ({
  src: `/fotografia${index + 1}.jpg`,
  alt: `Fotografía ${index + 1} de Torre 4000`,
}));

/* ------------------------- Encabezados de cada pagina ------------------- */
const heroImage = "/images/fondo-illimani.jpg";

export const pages: Record<
  "mirador" | "restaurante" | "sostenibilidad" | "eventos" | "contacto",
  PageIntro
> = {
  mirador: {
    crumb: "Mirador",
    eyebrow: "Mirador Torre 4000",
    title: "La ciudad a tus pies",
    subtitle: "Un recorrido en imágenes por las alturas de El Alto y La Paz.",
    image: heroImage,
    position: "50% 18%",
  },
  restaurante: {
    crumb: "Restaurante",
    eyebrow: "Restaurante",
    title: "Fuego 4086",
    subtitle: "Presentado como el restaurante más alto de Latinoamérica.",
    image: heroImage,
    position: "50% 70%",
  },
  sostenibilidad: {
    crumb: "Sostenibilidad",
    eyebrow: "Sostenibilidad",
    title: "Pensada para la altura",
    subtitle: "El primer rascacielos ecológico de altura.",
    image: heroImage,
    position: "20% 30%",
  },
  eventos: {
    crumb: "Eventos",
    eyebrow: "Eventos",
    title: "Eventos en las alturas",
    subtitle: "Un lugar para reunirse, celebrar y apoyar causas.",
    image: heroImage,
    position: "80% 40%",
  },
  contacto: {
    crumb: "Contacto",
    eyebrow: "Contacto y ubicación",
    title: "Cómo llegar",
    subtitle: "Estamos en El Alto, con La Paz y el Illimani de frente.",
    image: heroImage,
    position: "50% 50%",
  },
};

/* ---------------------------------- Inicio ------------------------------ */
export const home = {
  statement:
    "Nace un nuevo ícono para La Paz y El Alto. Un mirador, un restaurante y un lugar para vivir la ciudad desde otra altura.",
  marquee: ["Mirador", "Restaurante", "Sostenibilidad", "Eventos", "Fuego 4086"],
  panelsTitle: "Descubre Torre 4000",
  panels: [
    {
      number: "01",
      title: "Mirador",
      text: "Fotografías y vistas panorámicas de La Paz y El Alto.",
      href: "/mirador",
      image: "/fotografia1.jpg",
      position: "50% 50%",
    },
    {
      number: "02",
      title: "Fuego 4086",
      text: "El restaurante presentado como el más alto de Latinoamérica.",
      href: "/restaurante",
      image: "/fotografia2.jpg",
      position: "50% 50%",
    },
    {
      number: "03",
      title: "Sostenibilidad",
      text: "El primer rascacielos ecológico de altura.",
      href: "/sostenibilidad",
      image: "/fotografia3.jpg",
      position: "50% 50%",
    },
    {
      number: "04",
      title: "Eventos",
      text: "Celebraciones, encuentros y causas solidarias.",
      href: "/eventos",
      image: "/fotografia4.jpg",
      position: "50% 50%",
    },
    {
      number: "05",
      title: "Cómo llegar",
      text: "Traza tu ruta hasta la torre y mira los datos de contacto.",
      href: "/contacto#ruta",
      image: "/fotografia5.jpg",
      position: "50% 50%",
    },
  ] as HomePanel[],
};

/* --------------------------------- Mirador ------------------------------ */
export const mirador = {
  statement:
    "Desde lo alto de El Alto, La Paz se despliega entre montañas y luces, con el Illimani como telón de fondo. Un nuevo punto de encuentro para mirar la ciudad desde otra altura.",
  galleryTitle: "Galería",
  galleryHint: "Desliza hacia abajo",
};

/* ------------------------------- Restaurante ---------------------------- */
// TODO: reemplazar por datos oficiales cuando esten disponibles.
export const restaurant = {
  name: "FUEGO 4086",
  number: 4086,
  numberLabel: "El número que da nombre al restaurante",
  tagline: "Presentado como el restaurante más alto de Latinoamérica",
  text: "Un restaurante a gran altura dentro de la Torre 4000, pensado para vivir la ciudad de otra manera.",
  moments: [
    {
      title: "El fuego",
      text: "El fuego da nombre y carácter al restaurante: una experiencia pensada para sentirse desde el primer momento.",
    },
    {
      title: "La altura",
      text: "El número 4086 acompaña cada visita. Comer a esta altura es parte de la historia de la torre.",
    },
    {
      title: "La ciudad encendida",
      text: "Cuando cae la noche, La Paz y El Alto se iluminan a tus pies.",
    },
  ] as Feature[],
  marquee: ["Fuego", "Altura", "Vista", "Sabor", "Noche"],
};

/* ----------------------------- Sostenibilidad --------------------------- */
// TODO: reemplazar los pilares por informacion oficial del proyecto.
export const sostenibilidad = {
  statement:
    "Torre 4000 se presenta como el primer rascacielos ecológico de altura. Aquí compartiremos el compromiso ambiental del proyecto.",
  pillars: [
    {
      title: "Diseño para la altura",
      text: "Una torre pensada para convivir con el clima y el paisaje del altiplano.",
    },
    {
      title: "Uso responsable",
      text: "Criterios de eficiencia en el uso de energía y recursos durante su operación.",
    },
    {
      title: "Comunidad",
      text: "Un espacio abierto a la ciudad que impulsa el turismo y las iniciativas locales.",
    },
  ] as Feature[],
};

/* --------------------------------- Eventos ------------------------------ */
export const eventos = {
  eyebrow: "Eventos",
  title: "Más que un mirador",
  text: "Un lugar para reunirse, celebrar y apoyar causas desde las alturas.",
  background: "/images/fondo-illimani.jpg",
  items: [
    {
      tag: "Solidario",
      title: "Funciones de cine solidarias",
      text: "CINEBOL se comprometió con la campaña navideña “Por la Ch'iti Sonrisa de los Niños”, impulsada por el Gobierno Autónomo Municipal de El Alto, con funciones de cine solidarias.",
      featured: true,
    },
    {
      tag: "Privados",
      title: "Celebraciones y encuentros",
      text: "Cumpleaños, cenas y reuniones con vista a la ciudad.",
    },
    {
      tag: "Institucional",
      title: "Lanzamientos y reuniones",
      text: "Un escenario distinto para encuentros con empresarios, invitados y autoridades.",
    },
  ] as EventItem[],
  marquee: ["Solidario", "Privados", "Institucional"],
};

/* ------------------------------- Contacto ------------------------------- */
export const contactoPage = {
  title: "Traza tu ruta",
  text: "Te ubicamos y dibujamos el camino hasta la Torre 4000. Elige cómo vas a llegar.",
};