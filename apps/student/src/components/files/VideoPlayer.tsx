'use client';

import React, { useEffect, useRef, useState } from 'react';
import { formatTime } from '@3de/auth';

interface VideoPlayerProps {
  src: string;              // رابط اليوتيوب مثل: https://www.youtube.com/watch?v=...
  lastWatched?: number;     // بالثواني
  onProgress?: (progress: number, duration: number) => void;
  onComplete?: () => void;
}

export default function VideoPlayer({
  src,
  lastWatched = 0,
  onProgress,
  onComplete
}: VideoPlayerProps) {
  const iframeRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<any>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  // const videoId = React.useMemo(() => {
  //   const urlParams = new URL(src).searchParams;
  //   return urlParams.get('v'); // استخرج ID الفيديو من رابط اليوتيوب
  // }, [src]);
  const videoId ="gPp0c9694eQ"
  useEffect(() => {
    if (!videoId) return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    function initPlayer() {
      const newPlayer = new window.YT.Player(iframeRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          fs: 0,
          iv_load_policy: 3,
          showinfo: 0,
        },
        events: {
          onReady: (event: any) => {
            setDuration(event.target.getDuration());
            if (lastWatched) event.target.seekTo(lastWatched);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              onComplete?.();
            }
          }
        }
      });
      setPlayer(newPlayer);
    }
  }, [videoId, lastWatched, onComplete]);

  // تحديث التقدم كل ثانية
  useEffect(() => {
    if (!player) return;
    const interval = setInterval(() => {
      const currentTime = player.getCurrentTime?.() || 0;
      const total = player.getDuration?.() || 0;
      onProgress?.(currentTime, total);
    }, 1000);
    return () => clearInterval(interval);
  }, [player, onProgress]);

  const togglePlay = () => {
    if (!player) return;
    console.log("togglePlay");
    if (playing) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    setPlaying(!playing);
  };

  return (
    <div className="space-y-3">
      {/* <div className="aspect-video rounded-lg overflow-hidden relative bg-black">
        <div ref={iframeRef} className="w-full h-full" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <button
            onClick={togglePlay}
            className="px-4 py-2 bg-white rounded shadow cursor-pointer"
          >
            {playing ? 'إيقاف' : 'تشغيل'}
          </button>
        </div>
      </div>

      {lastWatched > 0 && (
        <p className="text-sm text-muted-foreground">
          بدأت من الدقيقة: <span className="font-medium">{formatTime(lastWatched)}</span>
        </p>
      )} */}
      <VideoPlayerLite videoId={videoId} />
    </div>
  );
}




export function VideoPlayerLite({ videoId }: { videoId: string }) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="aspect-video relative rounded-lg overflow-hidden bg-black">
      {!playing && (
        <button
          className="absolute inset-0 w-full h-full flex items-center justify-center"
          onClick={() => setPlaying(true)}
          aria-label="تشغيل الفيديو"
        >
          <img
            src={thumb}
            alt="فيديو"
            className="object-cover w-full h-full"
            style={{ filter: 'brightness(0.7)' }}
          />
          <span className="absolute flex items-center justify-center w-20 h-20 bg-black/50 rounded-full">
            <svg viewBox="0 0 68 48" width="48" height="48">
              <path d="M66.52,7.86A8,8,0,0,0,59.38,1H8.62A8,8,0,0,0,1.48,7.86,85.08,85.08,0,0,0,0,24a85.08,85.08,0,0,0,1.48,16.14A8,8,0,0,0,8.62,47h50.76a8,8,0,0,0,7.14-6.86A85.08,85.08,0,0,0,68,24,85.08,85.08,0,0,0,66.52,7.86ZM27,34V14l18,10Z" fill="#fff"/>
            </svg>
          </span>
        </button>
      )}
      {playing && (
        <iframe
          className="w-full h-full absolute inset-0"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      )}
    </div>
  );
}



// 'use client';

// import React, { useEffect, useRef, useState } from 'react';
// import ReactPlayer from 'react-player';

// import { formatTime } from '@3de/auth';

// interface VideoPlayerProps {
//   src: string;
//   lastWatched?: number; // بالثواني
//   onProgress?: (progress: number,duration:number) => void;
//   onComplete?: () => void;
// }

// export default function VideoPlayer({ src, lastWatched = 0, onProgress, onComplete }: VideoPlayerProps) {
//   const playerRef = useRef<any>(null);
//   const [showLastWatched, setShowLastWatched] = useState(true);
//   const [duration, setDuration] = useState(0);
//   const [playing, setPlaying] = useState(false);
//   // ⏪ ابدأ من آخر مشاهدة
//   useEffect(() => {
//     if (playerRef.current && lastWatched) {
//       playerRef.current.seekTo(lastWatched, 'seconds');
//     }
//   }, [lastWatched]);


//   return (
//     <div className="space-y-3">

//       <div className="aspect-video rounded-lg overflow-hidden relative">
//         <ReactPlayer
//           ref={playerRef}
//           src={src}
//           playing={playing}
//           controls={false}
//           width="100%"
//           height="100%"
//           onEnded={()=>{
//             onComplete?.();
//           }}
//         />
//         <div style={{
//         position: 'absolute',
//         bottom: 10,
//         left: 10,
//         display: 'flex',
//         gap: '10px'
//       }}>
//         <button onClick={() => setPlaying(!playing)}>
//           {playing ? 'إيقاف' : 'تشغيل'}
//         </button>
//       </div>
//       </div>

//       {showLastWatched && lastWatched > 0 && (
//         <p className="text-sm text-muted-foreground">
//           بدأت من الدقيقة: <span className="font-medium">{formatTime(lastWatched)}</span>
//         </p>
//       )}
//     </div>
//   );
// }
