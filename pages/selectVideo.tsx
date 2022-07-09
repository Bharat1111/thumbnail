import { useState } from "react"
import VideoSelectionList, {
  YoutubeVideoBlob,
} from "../components/videoSelectionList"
import ThumbnailSelectionContext from "../contexts/ThumbnailSelectionContext"

const selectVideo = () => {
  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideoBlob | null>(
    null
  )

  return (
    <ThumbnailSelectionContext.Provider
      value={{ selectedVideo, setSelectedVideo }}
    >
      <div className={`bg-navy-100 flex flex-col min-h-screen`}>
        <main className={`flex flex-col justify-center flex-1 py-5`}>
          <VideoSelectionList />
        </main>
      </div>
    </ThumbnailSelectionContext.Provider>
  )
}

export default selectVideo
