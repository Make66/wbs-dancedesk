import { VideoView, useVideoPlayer } from 'expo-video';

export function VideoCard() {
  const player = useVideoPlayer('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', (p) => {
    p.loop = true;
  });

  return <VideoView style={{ width: '100%', height: 220, borderRadius: 16 }} player={player} allowsFullscreen allowsPictureInPicture />;
}
