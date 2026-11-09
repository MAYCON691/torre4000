/* ==========================================================================
   TORRE 4000 - Datos del Tour 360
   --------------------------------------------------------------------------
   Recorrido (de abajo hacia arriba):
     Exterior > Planta baja (2) > Restaurante (2) > Mirador 2 (3) > Mirador 1 (2)

   Para mover una flecha: abre  /tour-360#calibrar  y haz clic en la escena.
   El panel de abajo te da el yaw y pitch listos para copiar aqui.
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

/** Hotspot sobre una imagen plana: posicion en % de la imagen */
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
 * de carga con las imagenes nuevas, cambia el numero (v2 -> v3).
 */
export const tourCacheKey = "t4-tour-cargado-v2";

export const tourIntro = {
  eyebrow: "Realidad virtual",
  title: "Tour 360",
  text: "Recorre la planta baja, el restaurante FUEGO 4086 y los dos miradores. Toca las flechas para avanzar y arrastra para mirar alrededor.",
  loading: "Cargando realidad virtual",
  startLabel: "Iniciar tour 360",
  /** Imagen de la portada (antes de dar play) */
  poster: "/imagenparatour.jpg",
};

/** Nombres de las zonas, en el orden del menu lateral */
export const tourZones = ["Exterior", "Planta baja", "Restaurante", "Mirador 2", "Mirador 1"];

export const tourScenes: TourScene[] = [
  /* ------------------------------ EXTERIOR ------------------------------ */
  {
    id: "exterior",
    kind: "pano",
    zone: "Exterior",
    title: "Torre 4000",
    kicker: "Exterior",
    src: "/tour/torre4000.jpg",
    start: { yaw: -10, pitch: 8 },
    hotspots: [
      { target: "planta-baja", label: "Entrar a la torre", kicker: "Planta baja", yaw: -10, pitch: -6 },
    ],
  },

  /* ----------------------------- PLANTA BAJA ---------------------------- */
  {
    id: "planta-baja",
    kind: "pano",
    zone: "Planta baja",
    title: "Planta baja",
    kicker: "Nivel de ingreso",
    src: "/tour/plantabaja.jpg",
    start: { yaw: 0, pitch: 0 },
    hotspots: [
      { target: "planta-baja-2", label: "Seguir recorriendo", kicker: "Planta baja", yaw: 5, pitch: -28 },
      { target: "exterior", label: "Salir a la calle", kicker: "Exterior", arrow: "down", yaw: 150, pitch: -28 },
    ],
  },
  {
    id: "planta-baja-2",
    kind: "pano",
    zone: "Planta baja",
    title: "Planta baja · Vista 2",
    kicker: "Nivel de ingreso",
    src: "/tour/plantabaja-1.jpg",
    start: { yaw: 0, pitch: 0 },
    hotspots: [
      { target: "restaurante", label: "Subir al restaurante", kicker: "FUEGO 4086", yaw: 0, pitch: -30 },
      { target: "planta-baja", label: "Volver", arrow: "down", yaw: 170, pitch: -28 },
    ],
  },

  /* ----------------------------- RESTAURANTE ---------------------------- */
  {
    id: "restaurante",
    kind: "pano",
    zone: "Restaurante",
    title: "Restaurante FUEGO 4086",
    kicker: "Nivel medio",
    src: "/tour/restaurante4086.jpg",
    start: { yaw: 0, pitch: 0 },
    hotspots: [
      { target: "restaurante-2", label: "Seguir recorriendo", kicker: "Siguiente", yaw: 80, pitch: -28 },
      { target: "planta-baja-2", label: "Bajar a planta baja", kicker: "Planta baja", arrow: "down", yaw: -150, pitch: -32 },
    ],
  },
  {
    id: "restaurante-2",
    kind: "pano",
    zone: "Restaurante",
    title: "Restaurante · Vista 2",
    kicker: "FUEGO 4086",
    src: "/tour/restaurante4086-1.jpg",
    start: { yaw: 0, pitch: 0 },
    hotspots: [
      { target: "mirador-2", label: "Subir al mirador", kicker: "Mirador 2", yaw: 0, pitch: -30 },
      { target: "restaurante", label: "Volver a la entrada", arrow: "down", yaw: 170, pitch: -28 },
    ],
  },

  /* ------------------------------ MIRADOR 2 ----------------------------- */
  {
    id: "mirador-2",
    kind: "pano",
    zone: "Mirador 2",
    title: "Mirador 2",
    kicker: "Nivel alto",
    src: "/tour/mirador2.jpg",
    start: { yaw: 0, pitch: 0 },
    hotspots: [
      { target: "mirador-2-1", label: "Seguir por el mirador", kicker: "Siguiente", yaw: 60, pitch: -28 },
      { target: "restaurante-2", label: "Bajar al restaurante", kicker: "FUEGO 4086", arrow: "down", yaw: -100, pitch: -32 },
    ],
  },
  {
    id: "mirador-2-1",
    kind: "pano",
    zone: "Mirador 2",
    title: "Mirador 2 · Vista 2",
    kicker: "Nivel alto",
    src: "/tour/mirador2-1.jpg",
    start: { yaw: 0, pitch: 0 },
    hotspots: [
      { target: "mirador-2-2", label: "Seguir por el mirador", kicker: "Siguiente", yaw: 45, pitch: -28 },
      { target: "mirador-2", label: "Volver", arrow: "down", yaw: 180, pitch: -28 },
    ],
  },
  {
    id: "mirador-2-2",
    kind: "pano",
    zone: "Mirador 2",
    title: "Mirador 2 · Vista 3",
    kicker: "Nivel alto",
    src: "/tour/mirador2-2.jpg",
    start: { yaw: 0, pitch: 0 },
    hotspots: [
      { target: "mirador-1", label: "Subir a la punta", kicker: "Mirador 1", yaw: 0, pitch: -32 },
      { target: "mirador-2-1", label: "Volver", arrow: "down", yaw: 170, pitch: -28 },
    ],
  },

  /* ------------------------------ MIRADOR 1 ----------------------------- */
  {
    id: "mirador-1",
    kind: "pano",
    zone: "Mirador 1",
    title: "Mirador 1 · La punta",
    kicker: "El punto más alto",
    src: "/tour/mirador1.jpg",
    start: { yaw: 0, pitch: 0 },
    hotspots: [
      { target: "mirador-1-1", label: "Seguir recorriendo", kicker: "Siguiente", yaw: 50, pitch: -35 },
      { target: "mirador-2-2", label: "Bajar al mirador 2", kicker: "Mirador 2", arrow: "down", yaw: 180, pitch: -35 },
    ],
  },
  {
    id: "mirador-1-1",
    kind: "pano",
    zone: "Mirador 1",
    title: "Mirador 1 · Vista 2",
    kicker: "El punto más alto",
    src: "/tour/mirador1-1.jpg",
    start: { yaw: 0, pitch: 0 },
    hotspots: [
      { target: "mirador-1", label: "Volver", arrow: "down", yaw: 180, pitch: -35 },
      { target: "exterior", label: "Ver la torre por fuera", kicker: "Exterior", yaw: -90, pitch: 5 },
    ],
  },
];

export const sceneById: Record<string, TourScene> = Object.fromEntries(
  tourScenes.map((scene) => [scene.id, scene]),
);

export const firstSceneId = "exterior";