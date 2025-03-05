import React, { FC, useEffect, useState } from "react";
import axios from "axios";

type Props = {
  demoUrl: string;
};

const CoursePlayer: FC<Props> = ({ demoUrl }) => {
  const [videoData, setVideoData] = useState<{ otp: string; playbackInfo: string } | null>(null);

  

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3007/graphql`,
          {
            query: `
              mutation GenerateVideoUrl($videoId: String!) {
  generateVideoUrl(videoId: $videoId) {
    otp
    playbackInfo
  }
}

            `,
            variables: {
              videoId: demoUrl,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data?.data?.generateVideoUrl) {
          setVideoData(response.data.data.generateVideoUrl);
        } else {
          console.error("No video data returned", response.data);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchVideoData();
  }, [demoUrl]);

  if (!videoData?.otp || !videoData?.playbackInfo) {
    return <div>Loading...</div>; // Optionally replace with a loading spinner
  }
  

  return (
    <div style={{ position: "absolute", right:"300px"}}>
    <iframe
    style={{
      position:"absolute",
      top:0,
      bottom:0,
      right:0,
      left:0,
    }}
    allowFullScreen={true}
    width={300}
    height={190}
  src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData?.playbackInfo}&player=zg8dJx4ukxQfq3UB`}
  allow="encrypted-media"

></iframe>
    </div>
  );
};

export default CoursePlayer;
