import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import ThumbnailSelectionContext from "../contexts/ThumbnailSelectionContext"

type ThumbnailType = {
  url: string
  width: number
  height: number
}

type ThumbnailBlob = {
  medium: ThumbnailType
  default: ThumbnailType
  high: ThumbnailType
  standard: ThumbnailType
  maxres: ThumbnailType
}

export type YoutubeVideoBlob = {
  id: string
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: ThumbnailBlob
    channelTitle: string
  }
}

const getBestThumnail = (thumbnails: ThumbnailBlob): string => {
  return thumbnails?.medium?.url || thumbnails?.default?.url
}

const VideoSelectionList = () => {
  const [videos, setVideos] = useState<YoutubeVideoBlob[]>([])
  const { selectedVideo, setSelectedVideo } = useContext(
    ThumbnailSelectionContext
  )

  useEffect(() => {
    axios.get("/api/youtube/videos").then((res) => {
      let data = res.data
      let partialVideos = data.slice(0, 5)
      setVideos(partialVideos)
    })
  }, [])
  return (
    <div className="flex flex-row gap-2 overflow-x-auto p-2">
      {videos.map((video, idx) => {
        let thumbnails = video.snippet?.thumbnails
        return (
          <div
            key={idx}
            onClick={() => setSelectedVideo(video)}
            className={
              selectedVideo?.id === video.id
                ? "border-[3px] border-gray-300"
                : ""
            }
          >
            <img
              width="270px"
              height="151px"
              src={getBestThumnail(thumbnails)}
            />
            {/* <h4 className="font text-sm">
                        {video.snippet?.title}
                    </h4> */}
          </div>
        )
      })}
    </div>
  )
}

export default VideoSelectionList
