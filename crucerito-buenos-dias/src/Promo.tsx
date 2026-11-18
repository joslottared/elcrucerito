import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadBungee } from "@remotion/google-fonts/Bungee";
import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";

const { fontFamily: bungee } = loadBungee();
const { fontFamily: archivo } = loadArchivo("normal", { weights: ["600", "900"] });

export type Tema = "clara" | "oscura";
export type PromoProps = { tema: Tema };

const NARANJA = "#E8743B";
const AMARILLO = "#F2C14E";
const AZUL_NOCHE = "#0B1F33";

const TEMAS = {
  clara: {
    fondo: "#F4EFE6",
    texto: "#0B1F33",
    bebida: "#2E6670",
    direccion: "#5A6B7C",
    iconos: "claro",
  },
  oscura: {
    fondo: "#0B1F33",
    texto: "#FFFFFF",
    bebida: "#7FB3BB",
    direccion: "#A9B6C3",
    iconos: "oscuro",
  },
} as const;

const WIDTH = 1080;
const HEIGHT = 1350;
const BAND_H = 150;
const BODY_BOTTOM = 1120;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE_OUT = Easing.out(Easing.cubic);

// Un taco de la fila: brinca en su turno (cada 0.12 s desde 2.1 s) y luego flota.
const TacoIcon: React.FC<{ src: string; index: number }> = ({ src, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (sec: number) => sec * fps;

  const start = s(2.1) + index * s(0.12);
  const entry = spring({
    frame: Math.max(0, frame - start),
    fps,
    config: { damping: 10 },
  });

  // Flota solo después de terminar su entrada (rampa de 0.5 s para no saltar).
  const entryEnd = start + s(0.6);
  const env = interpolate(frame, [entryEnd, entryEnd + s(0.5)], [0, 1], CLAMP);
  const floatY = -4 * Math.sin((frame / fps) * 3.2 + index) * env;

  return (
    <div
      style={{
        width: 120,
        height: 92,
        flexShrink: 0,
        transformOrigin: "50% 100%",
        transform: `translateY(${floatY}px) scale(${entry})`,
      }}
    >
      <Img src={staticFile(src)} style={{ width: 120, height: 92, display: "block" }} />
    </div>
  );
};

export const Promo: React.FC<PromoProps> = ({ tema }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (sec: number) => sec * fps;
  const t = TEMAS[tema];

  // Franja naranja: baja de -150 a 0 en 0–0.5 s.
  const bandY = interpolate(frame, [0, s(0.5)], [-BAND_H, 0], { ...CLAMP, easing: EASE_OUT });

  // ¡PROMOCIÓN!: 0.35–0.85 s, escala 0.85 → 1 con spring y rebote.
  const promoStart = s(0.35);
  const promoOpacity = interpolate(frame, [promoStart, s(0.85)], [0, 1], CLAMP);
  const promoScale =
    0.85 +
    0.15 *
      spring({
        frame: Math.max(0, frame - promoStart),
        fps,
        durationInFrames: s(0.5),
        config: { damping: 9, stiffness: 180 },
      });

  // 5 TACOS: 1.0–1.6 s, escala 1.35 → 1 con spring (damping ~10), aparece rápido.
  const tacosStart = s(1.0);
  const tacosOpacity = interpolate(frame, [tacosStart, tacosStart + s(0.13)], [0, 1], CLAMP);
  const tacosEntry =
    1.35 -
    0.35 *
      spring({
        frame: Math.max(0, frame - tacosStart),
        fps,
        durationInFrames: s(0.6),
        config: { damping: 10 },
      });

  // Y UNA BEBIDA: sube 40px y aparece 1.5–1.95 s.
  const bebidaY = interpolate(frame, [s(1.5), s(1.95)], [40, 0], { ...CLAMP, easing: EASE_OUT });
  const bebidaOpacity = interpolate(frame, [s(1.5), s(1.95)], [0, 1], CLAMP);

  // Vaso: 0.2 s después del quinto taco (inicio 2.1 + 4·0.12 + 0.2 s).
  const vasoStart = s(2.1) + 4 * s(0.12) + s(0.2);
  const vasoEntry = spring({
    frame: Math.max(0, frame - vasoStart),
    fps,
    config: { damping: 12 },
  });
  const vasoY = interpolate(vasoEntry, [0, 1], [40, 0]);
  const vasoOpacity = interpolate(frame, [vasoStart, vasoStart + s(0.1)], [0, 1], CLAMP);

  // POR SOLO: 3.4–3.8 s, desde translateX(-50px) con fade.
  const porX = interpolate(frame, [s(3.4), s(3.8)], [-50, 0], { ...CLAMP, easing: EASE_OUT });
  const porOpacity = interpolate(frame, [s(3.4), s(3.8)], [0, 1], CLAMP);

  // $99: 3.7–4.4 s, escala 1.6 → 1 con spring (damping ~8, un rebote), aparece en 4 frames.
  const precioStart = s(3.7);
  const precioOpacity = interpolate(frame, [precioStart, precioStart + 4], [0, 1], CLAMP);
  const precioEntry = spring({
    frame: Math.max(0, frame - precioStart),
    fps,
    durationInFrames: s(0.7),
    config: { damping: 8 },
  });
  const precioScaleIn = interpolate(precioEntry, [0, 1], [1.6, 1]);
  // Latido: 5.6–6.2 s, 1 → 1.06 → 1.
  const precioPulse = interpolate(frame, [s(5.6), s(5.9), s(6.2)], [1, 1.06, 1], CLAMP);

  // Firma: sube 30px y aparece 4.6–5.2 s.
  const signY = interpolate(frame, [s(4.6), s(5.2)], [30, 0], { ...CLAMP, easing: EASE_OUT });
  const signOpacity = interpolate(frame, [s(4.6), s(5.2)], [0, 1], CLAMP);

  const precioText = (
    <div
      style={{
        fontFamily: bungee,
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...(tema === "oscura"
          ? { fontSize: 250, color: AMARILLO }
          : {
              fontSize: 230,
              color: AZUL_NOCHE,
              backgroundColor: AMARILLO,
              padding: "18px 36px 4px",
              borderRadius: 0,
            }),
      }}
    >
      $99
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: t.fondo,
        width: WIDTH,
        height: HEIGHT,
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {/* 1. Franja naranja */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: WIDTH,
          height: BAND_H,
          backgroundColor: NARANJA,
          transform: `translateY(${bandY}px)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: bungee,
            fontSize: 92,
            lineHeight: 1,
            color: AZUL_NOCHE,
            opacity: promoOpacity,
            transform: `scale(${promoScale})`,
            whiteSpace: "nowrap",
          }}
        >
          ¡PROMOCIÓN!
        </div>
      </div>

      {/* 2. Contenido: x 48–1032, y 150–1120 */}
      <div
        style={{
          position: "absolute",
          top: BAND_H,
          left: 48,
          width: 984,
          height: BODY_BOTTOM - BAND_H,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        {/* a. Título */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              fontFamily: bungee,
              fontSize: 156,
              lineHeight: 1,
              color: t.texto,
              opacity: tacosOpacity,
              transform: `scale(${tacosEntry})`,
              whiteSpace: "nowrap",
            }}
          >
            5 TACOS
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: bungee,
              fontSize: 72,
              lineHeight: 1,
              color: t.bebida,
              opacity: bebidaOpacity,
              transform: `translateY(${bebidaY}px)`,
              whiteSpace: "nowrap",
            }}
          >
            Y UNA BEBIDA
          </div>
        </div>

        {/* b. Fila de iconos: 5 tacos (gap 18), espacio 22, vaso */}
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <TacoIcon key={i} src={`taco-${t.iconos}.svg`} index={i} />
            ))}
          </div>
          <div
            style={{
              marginLeft: 22,
              width: 74,
              height: 116,
              flexShrink: 0,
              opacity: vasoOpacity,
              transform: `translateY(${vasoY}px)`,
            }}
          >
            <Img
              src={staticFile(`vaso-${t.iconos}.svg`)}
              style={{ width: 74, height: 116, display: "block" }}
            />
          </div>
        </div>

        {/* c. Precio */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              fontFamily: archivo,
              fontWeight: 900,
              fontSize: 68,
              lineHeight: 0.95,
              textTransform: "uppercase",
              color: t.texto,
              opacity: porOpacity,
              transform: `translateX(${porX}px)`,
              whiteSpace: "nowrap",
            }}
          >
            <div>POR</div>
            <div>SOLO</div>
          </div>
          <div
            style={{
              opacity: precioOpacity,
              transform: `scale(${precioScaleIn * precioPulse})`,
            }}
          >
            {precioText}
          </div>
        </div>
      </div>

      {/* 3. Firma */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 56,
          width: WIDTH,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          opacity: signOpacity,
          transform: `translateY(${signY}px)`,
          whiteSpace: "nowrap",
        }}
      >
        <Img src={staticFile("logo.png")} style={{ width: 124, height: 124, display: "block" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: bungee,
              fontSize: 58,
              lineHeight: 1.1,
              color: t.texto,
            }}
          >
            EL CRUCERITO
          </div>
          <div
            style={{
              fontFamily: archivo,
              fontWeight: 600,
              fontSize: 32,
              lineHeight: 1.2,
              color: t.direccion,
            }}
          >
            Tacos al vapor — Mercurio 95b, Arenales Tapatíos
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
