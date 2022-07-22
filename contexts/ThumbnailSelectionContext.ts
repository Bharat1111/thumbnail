import { createContext } from "react"
import { YoutubeVideoBlob } from "../components/videoSelectionList"

type ThumnailSelectionContext = {
  selectedVideo: YoutubeVideoBlob | null
  setSelectedVideo: (video: YoutubeVideoBlob | null) => void
  thumbnailFiles: File[] | null
  setThumbnailFiles: (files: File[]) => void
  testLength: number
  setTestLength: (length: number) => void
}

const defaultContext = createContext<ThumnailSelectionContext>({
  selectedVideo: null,
  setSelectedVideo: () => {},
  thumbnailFiles: null,
  setThumbnailFiles: () => {},
  testLength: 0,
  setTestLength: () => {},
})

export default defaultContext
