import { getVideoMetadata } from "@remotion/media-utils";
import { Composition, staticFile } from "remotion";
import { AthletesEye, athletesEyeSchema } from "./AthletesEye";

const FPS = 30;
const DEFAULT_DEMO_DURATION_IN_SECONDS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      calculateMetadata={async ({ props }) => {
        if (props.durationInSeconds) {
          return {
            durationInFrames: Math.max(
              1,
              Math.floor(props.durationInSeconds * FPS),
            ),
            fps: FPS,
          };
        }

        if (!props.videoSrc) {
          return {
            durationInFrames: DEFAULT_DEMO_DURATION_IN_SECONDS * FPS,
            fps: FPS,
          };
        }

        const metadata = await getVideoMetadata(props.videoSrc);

        return {
          durationInFrames: Math.max(
            1,
            Math.floor(metadata.durationInSeconds * FPS),
          ),
          fps: FPS,
        };
      }}
      component={AthletesEye}
      defaultProps={{
        accentColor: "#20e3b2",
        durationInSeconds: DEFAULT_DEMO_DURATION_IN_SECONDS,
        gpxSrc: staticFile("sample.gpx"),
        videoSrc: null,
      }}
      fps={FPS}
      height={1920}
      id="AthletesEye"
      schema={athletesEyeSchema}
      width={1080}
    />
  );
};
