import { Composition } from "remotion";
import { BuenosDias } from "./BuenosDias";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="BuenosDias"
      component={BuenosDias}
      durationInFrames={240}
      fps={30}
      width={1080}
      height={1350}
    />
  );
};
