import React, { useEffect, useRef } from "react";

const Video = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return (
    <div className="relative flex justify-center items-center w-full ">
      <video
        ref={videoRef}
        className="rounded-lg shadow-xl border-4 border-primary"
        controls
        width="1200"
        height="700"
        muted
      >
        <source
          src="https://res.cloudinary.com/dcsowksj2/video/upload/v1735811237/Untitled_video_-_Made_with_Clipchamp_1_o8temq.mp4"
          type="video/mp4"
        />
        הדפדפן שלך אינו תומך בתג וידאו.
      </video>
    </div>
  );
};

export default Video;
