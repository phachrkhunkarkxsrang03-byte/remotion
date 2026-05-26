import { getVideoMetadata } from "@remotion/media-utils";
import { Composition, staticFile } from "remotion";
import { AthletesEye, athletesEyeSchema } from "./AthletesEye";

const FPS = 30;
const DEFAULT_VIDEO_SRC = "https://remotion.media/BigBuckBunny.mp4";
const DEFAULT_DEMO_DURATION_IN_SECONDS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      calculateMetadata={async ({ props }) => {
        const metadata = await getVideoMetadata(props.videoSrc);
        const durationInSeconds =
          props.durationInSeconds ??
          (props.videoSrc === DEFAULT_VIDEO_SRC
            ? DEFAULT_DEMO_DURATION_IN_SECONDS
            : metadata.durationInSeconds);

        return {
          durationInFrames: Math.max(
            1,
            Math.floor(
              Math.min(durationInSeconds, metadata.durationInSeconds) * FPS,
            ),
          ),
          fps: FPS,
        };
      }}
      component={AthletesEye}
      defaultProps={{
        accentColor: "#20e3b2",
        gpxSrc: staticFile("sample.gpx"),
        videoSrc: DEFAULT_VIDEO_SRC,
      }}
      fps={FPS}
      height={1920}
      id="AthletesEye"
      schema={athletesEyeSchema}
      width={1080}
    />
  );
};
