import { createContext } from "react"
import { YoutubeVideoBlob } from "../components/videoSelectionList"

type ThumnailSelectionContext = {
    selectedVideo: YoutubeVideoBlob | null,
    setSelectedVideo: (video: YoutubeVideoBlob) => void,
}

const defaultContext = createContext<ThumnailSelectionContext>({
    selectedVideo: null,
    setSelectedVideo: () => {},
})

export default defaultContext