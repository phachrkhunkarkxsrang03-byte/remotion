import type { RoutePoint } from "./route-utils";

type ProjectedPoint = {
  x: number;
  y: number;
};

const VIEWBOX_SIZE = 1000;
const PADDING = 80;

const getBounds = (route: RoutePoint[]) => {
  const latitudes = route.map((point) => point.latitude);
  const longitudes = route.map((point) => point.longitude);

  return {
    maxLatitude: Math.max(...latitudes),
    maxLongitude: Math.max(...longitudes),
    minLatitude: Math.min(...latitudes),
    minLongitude: Math.min(...longitudes),
  };
};

const projectRoute = (
  route: RoutePoint[],
  bounds: ReturnType<typeof getBounds>,
): ProjectedPoint[] => {
  const latitudeRange = bounds.maxLatitude - bounds.minLatitude || 1;
  const longitudeRange = bounds.maxLongitude - bounds.minLongitude || 1;
  const drawableSize = VIEWBOX_SIZE - PADDING * 2;

  return route.map((point) => {
    return {
      x:
        PADDING +
        ((point.longitude - bounds.minLongitude) / longitudeRange) *
          drawableSize,
      y:
        VIEWBOX_SIZE -
        PADDING -
        ((point.latitude - bounds.minLatitude) / latitudeRange) * drawableSize,
    };
  });
};

const toPolylinePoints = (points: ProjectedPoint[]) => {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
};

export const RouteMap: React.FC<{
  route: RoutePoint[];
  completedRoute: RoutePoint[];
  accentColor: string;
}> = ({ route, completedRoute, accentColor }) => {
  const bounds = getBounds(route);
  const projectedRoute = projectRoute(route, bounds);
  const projectedCompletedRoute = projectRoute(completedRoute, bounds);
  const currentPoint =
    projectedCompletedRoute[projectedCompletedRoute.length - 1] ??
    projectedRoute[0];
  const endPoint = projectedRoute[projectedRoute.length - 1];

  return (
    <svg
      aria-label="Activity route"
      role="img"
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        overflow: "visible",
      }}
    >
      <polyline
        fill="none"
        points={toPolylinePoints(projectedRoute)}
        stroke="#004DE8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={54}
      />
      <polyline
        fill="none"
        points={toPolylinePoints(projectedCompletedRoute)}
        stroke={accentColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={34}
      />
      {endPoint ? (
        <circle
          cx={endPoint.x}
          cy={endPoint.y}
          fill="#0c1018"
          r={32}
          stroke="white"
          strokeWidth={18}
        />
      ) : null}
      {currentPoint ? (
        <circle
          cx={currentPoint.x}
          cy={currentPoint.y}
          fill="white"
          r={46}
          stroke={accentColor}
          strokeWidth={22}
        />
      ) : null}
    </svg>
  );
};
