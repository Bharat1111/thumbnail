import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import ThumbnailSelectionContext from "../contexts/ThumbnailSelectionContext"
import TextInput from "./TextInput"

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
  const [displayedVideos, setDisplayedVideos] = useState<YoutubeVideoBlob[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const { selectedVideo, setSelectedVideo } = useContext(
    ThumbnailSelectionContext
  )

  useEffect(() => {
    axios.get("/api/youtube/videos").then((res) => {
      let allVideos = res.data
      setDisplayedVideos(allVideos.slice(0, 5))
      setVideos(allVideos)
    })
  }, [])

  useEffect(() => {
    // searchTerm is a youtube url, get out the videoId
    if (searchTerm.includes("youtube.com")) {
      let videoId = searchTerm.split("v=")[1]
      if (videoId) {
        let ampersandPosition = videoId.indexOf("&")
        if (ampersandPosition !== -1) {
          videoId = videoId.substring(0, ampersandPosition)
        }
        const foundVideo = videos.find((video) => video.id === videoId)
        if (foundVideo) {
          setDisplayedVideos([foundVideo])
          setSelectedVideo(foundVideo)
        } 
      }
    } else if (searchTerm.includes("youtu.be")) {
      let videoId = searchTerm.split("/")[3]
      if (videoId) {
        const foundVideo = videos.find((video) => video.id === videoId)
        if (foundVideo) {
          setDisplayedVideos([foundVideo])
          setSelectedVideo(foundVideo)
        }
      }
    }
  }, [searchTerm])

  useEffect(() => {
    if (!selectedVideo) {
      setDisplayedVideos(videos.slice(0, 5))
    }
  }, [selectedVideo])

  return (
    <div className=" w-[95%] p-2 pt-3 rounded-xl bg-[#E6F5F9]">
      <div className="flex flex-row">
        <div className="font-bold flex items-center justify-center text-3xl w-14 h-14 bg-[#BEDAE1] rounded-full">
          <span className="mt-[-3px]">1</span>
        </div>
        <div className="flex pl-2 flex-col w-[80%]">
          <h1 className="pb-2 pt-1 font-medium text-3xl text-black">
            Select a Video
          </h1>
          <div className="flex pb-4 flex-row gap-2 w-full overflow-x-auto p-2 pt-1">
            {displayedVideos.map((video, idx) => {
              let thumbnails = video.snippet?.thumbnails
              return (
                <div
                  key={idx}
                  onClick={() =>
                    selectedVideo !== video
                      ? setSelectedVideo(video)
                      : setSelectedVideo(null)
                  }
                  className={
                    "min-w-[160px] " +
                    (selectedVideo?.id === video.id
                      ? "border-[2px] border-black"
                      : "")
                  }
                >
                  <img
                    width="151px"
                    height="85px"
                    src={getBestThumnail(thumbnails)}
                  />
                </div>
              )
            })}
          </div>
          {/* <div className="flex flex-row w-full space-x-5"> */}
          <h1 className="font-medium text-3xl text-black">
            OR search for a video
          </h1>
          <TextInput
            placeholder="https://youtube.com/"
            initialValue={searchTerm}
            onUpdate={(l, value) => {
              setSearchTerm(value!)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default VideoSelectionList
