import { useState } from "react"
import UploadedThumbnailDisplayAndRemoval from "../components/ThumbnailDisplayAndRemoval"
import ThumbnailUploader from "../components/ThumbnailUploader"
import VideoSelectionList, {
  YoutubeVideoBlob,
} from "../components/videoSelectionList"
import ThumbnailSelectionContext from "../contexts/ThumbnailSelectionContext"

const selectVideo = () => {
  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideoBlob | null>(null)
  const [thumbnailFiles, setThumbnailFiles] = useState<File[]>([])
  const [testLength, setTestLength] = useState<number>(0)

  return (
    <ThumbnailSelectionContext.Provider
      value={{ selectedVideo, setSelectedVideo, thumbnailFiles, setThumbnailFiles, testLength, setTestLength }}
    >
      <div className={`bg-gray-800 flex flex-col min-h-screen`}>
        <main className={`flex flex-col justify-center flex-1 py-5`}>
          <VideoSelectionList />
          <ThumbnailUploader />
          <UploadedThumbnailDisplayAndRemoval />
        </main>
      </div>
    </ThumbnailSelectionContext.Provider>
  )
}

export default selectVideo
