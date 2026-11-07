/**
 * Descarga varias imagenes y avisa el avance (de 0 a 1).
 * Si ya estan guardadas en el dispositivo, termina casi al instante.
 */
export async function preloadAll(urls: string[], onProgress: (value: number) => void): Promise<void> {
  const unique = Array.from(new Set(urls));
  const parts = new Array<number>(unique.length).fill(0);
  const report = () => onProgress(parts.reduce((sum, value) => sum + value, 0) / unique.length);

  await Promise.all(
    unique.map(async (url, index) => {
      try {
        const response = await fetch(url, { cache: "force-cache" });
        if (!response.ok) return;

        const total = Number(response.headers.get("content-length")) || 0;
        if (!response.body || !total) {
          await response.blob();
          return;
        }

        const reader = response.body.getReader();
        let loaded = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          loaded += value.byteLength;
          parts[index] = Math.min(loaded / total, 0.99);
          report();
        }
      } catch {
        // Si una imagen falla seguimos: el visor avisa cuando se intente abrir
      } finally {
        parts[index] = 1;
        report();
      }
    }),
  );
}