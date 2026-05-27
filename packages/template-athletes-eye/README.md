# Athletes Eye Remotion template

Create a vertical sports activity video from a regular video file and a GPX route.

## Setup

Install dependencies:

```console
npm install
```

Start Remotion Studio:

```console
npm run dev
```

## Use your own activity

1. Add your video to `public/activity.mp4`.
2. Add your GPX file to `public/activity.gpx`.
3. Open `src/Root.tsx` and replace the default props:

```tsx
videoSrc: staticFile("activity.mp4"),
gpxSrc: staticFile("activity.gpx"),
```

The template uses `http://remotion.media/gopro-small.mp4` as the default video.
If Remotion Studio finds a video file in `public/`, it uses that local video
instead. Add `durationInSeconds` to the default props if you want to cap a long
activity video.

The GPX file should contain a track with latitude, longitude, elevation and time values.

## Render

```console
npx remotion render AthletesEye out/video.mp4
```
