import React, { useContext, useEffect, useState } from "react"
import axios from 'axios'
import ThumbnailSelectionContext from '../contexts/ThumbnailSelectionContext'

type ThumbnailType = {
    url: string
    width: number
    height: number
}

type ThumbnailBlob = {
    "medium": ThumbnailType
    "default": ThumbnailType
    "high": ThumbnailType
    "standard": ThumbnailType
    "maxres": ThumbnailType
}

export type YoutubeVideoBlob = {
    "id": string,
    "snippet": {
        "publishedAt": string,
        "channelId": string,
        "title": string,
        "description": string,
        "thumbnails": ThumbnailBlob,
        "channelTitle": string,
    }
}

const getBestThumnail = (thumbnails: ThumbnailBlob) => {
    return thumbnails?.medium?.url || thumbnails?.default?.url
}

const VideoSelectionList = () => {
    const [videos, setVideos] = useState<YoutubeVideoBlob[]>([])
    const { selectedVideo, setSelectedVideo } = useContext(ThumbnailSelectionContext)

    useEffect(() => {
        axios.get('/api/youtube/videos').then(res => {
            let allVideos = res.data
            let partialVideos = allVideos.slice(0, 5)
            setVideos(partialVideos)
        })
    }, [])
  return <div>videoSelectionList</div>
}

export default VideoSelectionList
