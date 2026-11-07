/* ==========================================================================
   TORRE 4000 - Datos del Tour 360
   --------------------------------------------------------------------------
   Para mover un hotspot: abre  /tour-360#calibrar  y haz clic en la escena.
   El panel de abajo te da las coordenadas listas para copiar aqui.
   ========================================================================== */

/** Hacia donde apunta la flecha del hotspot (por defecto "up") */
export type Arrow = "up" | "down" | "left" | "right";

/** Hotspot dentro de una escena 360: angulos en GRADOS */
export type Hotspot = {
  target: string;
  label: string;
  kicker?: string;
  arrow?: Arrow;
  /** 0 = al frente, 90 = a la derecha, -90 = a la izquierda, 180 = atras */
  yaw: number;
  /** + arriba, - abajo */
  pitch: number;
};

/** Hotspot sobre la imagen plana (exterior): posicion en % de la imagen */
export type FlatHotspot = {
  target: string;
  label: string;
  kicker?: string;
  arrow?: Arrow;
  x: number;
  y: number;
  /** Lado hacia donde sale la etiqueta */
  side: "left" | "right";
};

type Base = { id: string; zone: string; title: string; kicker: string };

export type FlatScene = Base & {
  kind: "flat";
  src: string;
  hotspots: FlatHotspot[];
};

export type PanoScene = Base & {
  kind: "pano";
  src: string;
  /** Hacia donde mira la camara al entrar */
  start: { yaw: number; pitch: number; zoom?: number };
  hotspots: Hotspot[];
};

export type TourScene = FlatScene | PanoScene;

/**
 * Si cambias las fotos 360 y quieres que los visitantes vuelvan a ver la pantalla
 * de carga con las imagenes nuevas, cambia el numero (v1 -> v2).
 */
export const tourCacheKey = "t4-tour-cargado-v1";

export const tourIntro = {
  eyebrow: "Realidad virtual",
  title: "Tour 360",
  text: "Recorre el mirador, el restaurante FUEGO 4086 y el lobby. Toca los puntos para entrar y arrastra para mirar alrededor.",
  loading: "Cargando realidad virtual",
  startLabel: "Iniciar tour 360",
  poster: "/imagenparatour.jpg",
};

export const tourScenes: TourScene[] = [
  /* ------------------------------ EXTERIOR ------------------------------ */
  {
    id: "exterior",
    kind: "flat",
    zone: "Exterior",
    title: "Torre 4000",
    kicker: "Exterior",
    src: "/imagenparatour.jpg",
    hotspots: [
      {
        target: "mirador",
        label: "Ver el mirador",
        kicker: "Nivel superior",
        x: 50,
        y: 22,
        side: "right",
      },
      {
        target: "restaurante",
        label: "Ver el restaurante",
        kicker: "Nivel medio · FUEGO 4086",
        x: 50,
        y: 50,
        side: "left",
      },
      {
        target: "lobby",
        label: "Ver el lobby",
        kicker: "Planta baja",
        x: 50,
        y: 72,
        side: "right",
      },
    ],
  },

  /* ------------------------------- MIRADOR ------------------------------ */
  {
    id: "mirador",
    kind: "pano",
    zone: "Mirador",
    title: "Mirador",
    kicker: "Nivel superior",
    src: "/360-1.jpg",
    start: { yaw: 0, pitch: 0 },
    hotspots: [
      { target: "mirador-vista", label: "Vista panorámica", kicker: "Siguiente", yaw: 70, pitch: -8 },
      { target: "restaurante", label: "Bajar al restaurante", kicker: "Nivel medio", arrow: "down", yaw: -110, pitch: -18 },
    ],
  },
  {
    id: "mirador-vista",
    kind: "pano",
    zone: "Mirador",
    title: "Vista panorámica",
    kicker: "Mirador",
    src: "/360-2.jpg",
    start: { yaw: 0, pitch: 0 },
    hotspots: [
      { target: "mirador", label: "Volver al mirador", arrow: "down", yaw: 180, pitch: -10 },
      { target: "exterior", label: "Ver la torre por fuera", kicker: "Exterior", yaw: -70, pitch: -6 },
    ],
  },

  /* ----------------------------- RESTAURANTE ---------------------------- */
  {
    id: "restaurante",
    kind: "pano",
    zone: "Restaurante",
    title: "Restaurante FUEGO 4086",
    kicker: "Nivel medio",
    src: "/360-3.jpg",
    start: { yaw: 0, pitch: 0 },
    hotspots: [
      { target: "restaurante-salon", label: "Salón principal", kicker: "Siguiente", yaw: 60, pitch: -5 },
      { target: "mirador", label: "Subir al mirador", kicker: "Nivel superior", yaw: -120, pitch: 12 },
      { target: "lobby", label: "Bajar al lobby", kicker: "Planta baja", arrow: "down", yaw: 150, pitch: -20 },
    ],
  },
  {
    id: "restaurante-salon",
    kind: "pano",
    zone: "Restaurante",
    title: "Salón principal",
    kicker: "FUEGO 4086",
    src: "/360-4.jpg",
    start: { yaw: 0, pitch: 0 },
    hotspots: [
      { target: "restaurante", label: "Volver a la entrada", arrow: "down", yaw: 180, pitch: -8 },
    ],
  },

  /* -------------------------------- LOBBY ------------------------------- */
  {
    id: "lobby",
    kind: "pano",
    zone: "Lobby",
    title: "Lobby",
    kicker: "Planta baja",
    src: "/360-5.jpg",
    start: { yaw: 0, pitch: 0 },
    hotspots: [
      { target: "lobby-ingreso", label: "Ingreso principal", kicker: "Siguiente", yaw: 50, pitch: -6 },
      { target: "restaurante", label: "Subir al restaurante", kicker: "Nivel medio", yaw: -100, pitch: 10 },
    ],
  },
  {
    id: "lobby-ingreso",
    kind: "pano",
    zone: "Lobby",
    title: "Ingreso principal",
    kicker: "Planta baja",
    src: "/360-6.jpg",
    start: { yaw: 0, pitch: 0 },
    hotspots: [
      { target: "lobby", label: "Entrar al lobby", yaw: 180, pitch: -6 },
      { target: "exterior", label: "Salir al exterior", kicker: "Exterior", yaw: 0, pitch: -4 },
    ],
  },
];

export const sceneById: Record<string, TourScene> = Object.fromEntries(
  tourScenes.map((scene) => [scene.id, scene]),
);

export const firstSceneId = "exterior";