import { Composition } from "remotion";
import { BuenosDias } from "./BuenosDias";
import { Promo } from "./Promo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BuenosDias"
        component={BuenosDias}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1350}
      />
      <Composition
        id="PromoClara"
        component={Promo}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{ tema: "clara" as const }}
      />
      <Composition
        id="PromoOscura"
        component={Promo}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{ tema: "oscura" as const }}
      />
    </>
  );
};
