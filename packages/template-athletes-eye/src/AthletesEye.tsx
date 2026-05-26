import { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { RouteMap } from "./RouteMap";
import {
  getRouteProgress,
  getRouteStats,
  parseGpx,
  type RoutePoint,
} from "./route-utils";

export const athletesEyeSchema = z.object({
  videoSrc: z.string(),
  gpxSrc: z.string(),
  accentColor: z.string(),
});

export type AthletesEyeProps = z.infer<typeof athletesEyeSchema>;

const useGpxRoute = (gpxSrc: string) => {
  const [route, setRoute] = useState<RoutePoint[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [handle] = useState(() => delayRender("Loading GPX route"));

  useEffect(() => {
    fetch(gpxSrc)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not load GPX file: ${response.status}`);
        }

        return response.text();
      })
      .then((contents) => {
        setRoute(parseGpx(contents));
        continueRender(handle);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        continueRender(handle);
      });
  }, [gpxSrc, handle]);

  if (error) {
    throw error;
  }

  return route;
};

const statStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const labelStyle: React.CSSProperties = {
  color: "rgba(255, 255, 255, 0.65)",
  fontSize: 28,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const valueStyle: React.CSSProperties = {
  color: "white",
  fontSize: 72,
  fontVariantNumeric: "tabular-nums",
  fontWeight: 800,
  letterSpacing: "-0.04em",
};

const Stat: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => {
  return (
    <div style={statStyle}>
      <div style={labelStyle}>{label}</div>
      <div style={valueStyle}>{value}</div>
    </div>
  );
};

export const AthletesEye: React.FC<AthletesEyeProps> = ({
  videoSrc,
  gpxSrc,
  accentColor,
}) => {
  const route = useGpxRoute(gpxSrc);
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const routeStats = useMemo(() => {
    return route ? getRouteStats(route) : null;
  }, [route]);

  const routeProgress = useMemo(() => {
    return route ? getRouteProgress(route, progress) : null;
  }, [progress, route]);

  if (!route || !routeStats || !routeProgress) {
    return null;
  }

  const speed =
    routeProgress.speedInKmh === null ? "--" : Math.round(routeProgress.speedInKmh);
  const elevation =
    routeProgress.currentPoint.elevation === null
      ? "--"
      : Math.round(routeProgress.currentPoint.elevation);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0c1018", fontFamily: "Arial" }}>
      <OffthreadVideo
        muted
        src={videoSrc}
        style={{
          height: "100%",
          objectFit: "cover",
          opacity: 0.78,
          width: "100%",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(12,16,24,0) 25%, rgba(12,16,24,0.92) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          padding: 72,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(12, 16, 24, 0.78)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: 44,
            boxShadow: "0 24px 80px rgba(0, 0, 0, 0.35)",
            display: "flex",
            flexDirection: "column",
            gap: 44,
            overflow: "hidden",
            padding: 44,
          }}
        >
          <div style={{ height: 420 }}>
            <RouteMap
              accentColor={accentColor}
              completedRoute={routeProgress.completedRoute}
              route={route}
            />
          </div>
          <div
            style={{
              display: "grid",
              gap: 28,
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <Stat
              label="Distance"
              value={`${routeProgress.distanceInKm.toFixed(1)} km`}
            />
            <Stat label="Speed" value={`${speed} km/h`} />
            <Stat label="Elevation" value={`${elevation} m`} />
            <Stat
              label="Route"
              value={`${routeStats.distanceInKm.toFixed(1)} km`}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
