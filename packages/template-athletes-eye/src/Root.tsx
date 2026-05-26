import { getVideoMetadata } from "@remotion/media-utils";
import { Composition, staticFile } from "remotion";
import { AthletesEye, athletesEyeSchema } from "./AthletesEye";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      calculateMetadata={async ({ props }) => {
        const metadata = await getVideoMetadata(props.videoSrc);

        return {
          durationInFrames: Math.floor(metadata.durationInSeconds * FPS),
          fps: FPS,
        };
      }}
      component={AthletesEye}
      defaultProps={{
        accentColor: "#20e3b2",
        gpxSrc: staticFile("sample.gpx"),
        videoSrc: "https://remotion.media/BigBuckBunny.mp4",
      }}
      fps={FPS}
      height={1920}
      id="AthletesEye"
      schema={athletesEyeSchema}
      width={1080}
    />
  );
};
