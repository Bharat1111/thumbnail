import axios from "axios"
import { useState } from "react"

import UploadedThumbnailDisplayAndRemoval from "../components/ThumbnailDisplayAndRemoval"
import ThumbnailUploader from "../components/ThumbnailUploader"
import VideoSelectionList, {
  YoutubeVideoBlob,
} from "../components/videoSelectionList"
import ThumbnailSelectionContext from "../contexts/ThumbnailSelectionContext"
import uploadSingleFile from "../utils/uploadFile"
import Layout from "../components/layout"
import { useSession } from "next-auth/react"

const selectVideo = () => {
  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideoBlob | null>(
    null
  )
  const [thumbnailFiles, setThumbnailFiles] = useState<File[]>([])
  const [testLength, setTestLength] = useState<number>(0)

  const { data: session, status } = useSession()

  const startTest = () => {
    if (!selectedVideo) {
      alert("Please select a video")
      return
    }
    setTestLength(thumbnailFiles.length)
    // let formData = new FormData()
    let fileUploads = thumbnailFiles.map((file) => {
      return uploadSingleFile(file)
      // formData.append(`thumbnail[]`, file)
    })
    const channelId = selectedVideo.snippet?.channelId
    Promise.all(fileUploads).then((results) => {
      // post to DB
      const thumbnails = results
      console.log("thumbnails", thumbnails)
      const today = new Date()
      const startDay = today.getUTCDate()
      const startMonth = today.getUTCMonth() + 1
      const startYear = today.getUTCFullYear() - 2000
      // force two digits MM-DD-YY
      const startDate =
        (startMonth < 10 ? "0" : "") +
        startMonth +
        "-" +
        (startDay < 10 ? "0" : "") +
        startDay +
        "-" +
        startYear
      const videoId = selectedVideo.id

      let toStore = {
        thumbnails,
        videoId,
        startDate,
        testLength,
        currentThumbnail: -1,
        channelId,
      }

      axios.post("/api/storage/saveTests", toStore).then(() => {
        alert("Test started")
      })
    })
  }

  return (
    <ThumbnailSelectionContext.Provider
      value={{
        selectedVideo,
        setSelectedVideo,
        thumbnailFiles,
        setThumbnailFiles,
        testLength,
        setTestLength,
      }}
    >
      <Layout>
        <div
          className={`w-full overflow-hidden bg-gray-800 flex flex-col min-h-screen`}
        >
          <main className={`ml-3 flex flex-col justify-center flex-1 py-5`}>
            {session && (
              <>
                <h1 className="pb-8 font-bold text-3xl text-white pl-3">
                  Select Video to Thumbnail test
                </h1>
                <VideoSelectionList />
              </>
            )}
            <h1 className="py-8 font-bold text-3xl text-white pl-3">
              Drop any number of Thumbnails
            </h1>
            <div className="flex flex-row justify-start pl-3 pb-8">
              <ThumbnailUploader />
              <UploadedThumbnailDisplayAndRemoval />
            </div>
            <p className="text-white text-xl pl-3 pb-4">
              Each thumbnail (including the original) will be tested for 3 days.
              Total test time: {(thumbnailFiles.length + 1) * 3} days{" "}
              <button
                onClick={startTest}
                className="text-white ml-3 text-xl bg-blue-500 w-24"
              >
                Start test
              </button>
            </p>
          </main>
        </div>
      </Layout>
    </ThumbnailSelectionContext.Provider>
  )
}

export default selectVideo
