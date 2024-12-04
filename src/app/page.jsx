"use client";
import { useRef, useState } from "react";
import YouTube from "react-youtube";

export default function Home() {
  const [videoId, setVideoId] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [loop, setLoop] = useState(false);
  const playerRef = useRef(null);

  const extractVideoId = (url) => {
    const regExp =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleSubmit = () => {
    const id = extractVideoId(videoId);
    if (id) {
      setVideoId(id);
      setLoop(true);
    } else {
      alert("Invalid YouTube URL!");
    }
  };

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    event.target.seekTo(startTime);
    event.target.playVideo();
  };

  const onPlayerStateChange = (event) => {
    if (event.data === 1 && loop) { // When video is playing
      const currentTime = playerRef.current.getCurrentTime();
      if (currentTime >= endTime) {
        console.log(startTime, endTime, currentTime);
        playerRef.current.seekTo(startTime);
      }
    }
  };

  return (
    <div className='flex flex-col items-center p-4 text-black'>
      <h1 className='text-2xl font-bold mb-4 text-white'>
        YouTube Video Looper
      </h1>
      <div className='flex flex-col space-y-3 w-full max-w-md'>
        <input
          type='text'
          placeholder='YouTube Video Link'
          className='border p-2 rounded'
          onChange={(e) => setVideoId(e.target.value)}
        />
        <input
          type='number'
          placeholder='Start Time (in Minutes)'
          className='border p-2 rounded'
          onChange={(e) => setStartTime(Number(e.target.value)*60)}
        />
        <input
          type='number'
          placeholder='End Time (in Minutes)'
          className='border p-2 rounded'
          onChange={(e) => setEndTime(Number(e.target.value)*60)}
        />
        <button
          className='bg-blue-500 text-white p-2 rounded'
          onClick={handleSubmit}
        >
          Play Video
        </button>
      </div>
      {videoId && (
        <div className='mt-6'>
          <YouTube
            videoId={videoId}
            onEnd = {()=>{playerRef.current.seekTo(startTime);}}
            opts={{
              playerVars: {
                autoplay: 1,
                controls: 1,
                start: startTime,
                end: endTime,
              },
            }}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
          />
        </div>
      )}
    </div>
  );
}
