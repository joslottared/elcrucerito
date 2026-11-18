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
const { fontFamily: archivo } = loadArchivo("normal", { weights: ["600"] });

const COLOR = {
  crema: "#F4EFE6",
  azul: "#0B1F33",
  naranja: "#E8743B",
  naranjaOscuro: "#C4532A",
  gris: "#5A6B7C",
};

const WIDTH = 1080;
const HEIGHT = 1350;
const BAND_H = 150;
const BODY_BOTTOM = 1120;
const SIGN_BOTTOM = 56;

const ITEMS = ["CHICHARRÓN", "PAPA", "FRIJOL", "DESHEBRADA"];

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE_OUT = Easing.out(Easing.cubic);

// Un renglón de la lista: taco que brinca + texto que entra 0.12 s después.
const Row: React.FC<{ label: string; index: number }> = ({ label, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (sec: number) => sec * fps;

  const start = s(2.0) + index * s(0.32);
  const tacoScale = spring({
    frame: Math.max(0, frame - start),
    fps,
    config: { damping: 8 },
  });

  // Flotar: arranca suave cuando el taco ya terminó de entrar.
  const entryEnd = start + s(0.6);
  const floatEnvelope = interpolate(frame, [entryEnd, entryEnd + s(0.5)], [0, 1], CLAMP);
  const floatY =
    -4 * Math.sin((frame / fps) * 3.2 + index) * floatEnvelope;

  const textStart = start + s(0.12);
  const textX = interpolate(frame, [textStart, textStart + s(0.4)], [-60, 0], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const textOpacity = interpolate(frame, [textStart, textStart + s(0.4)], [0, 1], CLAMP);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          width: 84,
          height: 64,
          flexShrink: 0,
          transformOrigin: "50% 100%",
          transform: `translateY(${floatY}px) scale(${tacoScale})`,
        }}
      >
        <Img
          src={staticFile("taco.svg")}
          style={{ width: 84, height: 64, display: "block" }}
        />
      </div>
      <div
        style={{
          fontFamily: bungee,
          fontSize: 80,
          lineHeight: 1,
          color: COLOR.azul,
          opacity: textOpacity,
          transform: `translateX(${textX}px)`,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const BuenosDias: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (sec: number) => sec * fps;

  // 1. Franja naranja: baja de -150 a 0 en 0–0.5 s, ease-out cúbico.
  const bandY = interpolate(frame, [0, s(0.5)], [-BAND_H, 0], {
    ...CLAMP,
    easing: EASE_OUT,
  });

  // ¡BUENOS DÍAS!: aparece 0.35–0.85 s, escala 0.85 → 1 con spring y rebote.
  const greetStart = s(0.35);
  const greetOpacity = interpolate(frame, [greetStart, s(0.85)], [0, 1], CLAMP);
  const greetSpring = spring({
    frame: Math.max(0, frame - greetStart),
    fps,
    durationInFrames: s(0.5),
    config: { damping: 9, stiffness: 180 },
  });
  const greetScale = 0.85 + 0.15 * greetSpring;

  // YA HAY: sube 40px y aparece 0.9–1.35 s.
  const yaHayY = interpolate(frame, [s(0.9), s(1.35)], [40, 0], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const yaHayOpacity = interpolate(frame, [s(0.9), s(1.35)], [0, 1], CLAMP);

  // TACOS: entra 1.2–1.8 s con escala 1.35 → 1 (spring, damping ~10),
  // y luego late una vez en 4.6–5.2 s (1 → 1.04 → 1).
  const tacosStart = s(1.2);
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
  const tacosPulse = interpolate(
    frame,
    [s(4.6), s(4.6) + s(0.3), s(5.2)],
    [1, 1.04, 1],
    CLAMP,
  );

  // Firma: sube 30px y aparece 3.6–4.2 s.
  const signY = interpolate(frame, [s(3.6), s(4.2)], [30, 0], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const signOpacity = interpolate(frame, [s(3.6), s(4.2)], [0, 1], CLAMP);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLOR.crema,
        width: WIDTH,
        height: HEIGHT,
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {/* 1. Franja naranja con saludo */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: WIDTH,
          height: BAND_H,
          backgroundColor: COLOR.naranja,
          transform: `translateY(${bandY}px)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: bungee,
            fontSize: 84,
            lineHeight: 1,
            color: COLOR.azul,
            opacity: greetOpacity,
            transform: `scale(${greetScale})`,
            whiteSpace: "nowrap",
          }}
        >
          ¡BUENOS DÍAS!
        </div>
      </div>

      {/* 2. Cuerpo: entre y=150 y y=1120 */}
      <div
        style={{
          position: "absolute",
          top: BAND_H,
          left: 0,
          width: WIDTH,
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
              fontSize: 120,
              lineHeight: 1,
              color: COLOR.naranjaOscuro,
              opacity: yaHayOpacity,
              transform: `translateY(${yaHayY}px)`,
              whiteSpace: "nowrap",
            }}
          >
            YA HAY
          </div>
          <div
            style={{
              fontFamily: bungee,
              fontSize: 216,
              lineHeight: 0.95,
              color: COLOR.azul,
              opacity: tacosOpacity,
              transform: `scale(${tacosEntry * tacosPulse})`,
              whiteSpace: "nowrap",
            }}
          >
            TACOS
          </div>
        </div>

        {/* b. Lista, alineada a la izquierda y centrada como bloque */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "flex-start" }}>
          {ITEMS.map((label, i) => (
            <Row key={label} label={label} index={i} />
          ))}
        </div>
      </div>

      {/* 3. Firma */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: SIGN_BOTTOM,
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
        <Img
          src={staticFile("logo.png")}
          style={{ width: 124, height: 124, display: "block" }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: bungee,
              fontSize: 58,
              lineHeight: 1.1,
              color: COLOR.azul,
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
              color: COLOR.gris,
            }}
          >
            Tacos al vapor — Mercurio 95b, Arenales Tapatíos
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
