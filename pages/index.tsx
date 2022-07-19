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
    setTestLength((thumbnailFiles.length + 1) * 3)
    // let formData = new FormData()
    let fileUploads = thumbnailFiles.map((file) => {
      return uploadSingleFile(file)
      // formData.append(`thumbnail[]`, file)
    })
    let fileUrl = `https://img.youtube.com/vi/${selectedVideo.id}/0.jpg`
    fileUploads.unshift(
      axios
        .get("/api/storage/moveFileToServer?fileUrl=" + fileUrl)
        .then((res) => res.data)
    )
    const channelId = selectedVideo.snippet?.channelId
    Promise.all(fileUploads).then((results) => {
      // post to DB
      const thumbnails = results
      console.log("thumbnails", thumbnails)
      const today = new Date()
      const startDay = today.getUTCDate()
      const startMonth = today.getUTCMonth() + 1
      const startYear = today.getUTCFullYear()
      // force two digits YYYY-MM-DD

      const startDate =
        startYear +
        "-" +
        (startMonth < 10 ? "0" : "") +
        startMonth +
        "-" +
        (startDay < 10 ? "0" : "") +
        startDay
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
        <div className={`w-full overflow-hidden flex flex-col min-h-screen`}>
          <main className={`ml-3 flex flex-col flex-1 pl-3`}>
            {session && (
              <>
                <h1 className="py-4 font-bold text-3xl text-white">
                  Select Video to Thumbnail test
                </h1>
                <VideoSelectionList />
              </>
            )}
            <h1 className="py-8 font-bold text-3xl text-white">
              Drop any number of Thumbnails
            </h1>
            <div className="flex flex-row justify-start pb-8">
              <ThumbnailUploader />
              <UploadedThumbnailDisplayAndRemoval />
            </div>
            <p className="text-white text-xl">
              Each thumbnail (including the original) will be tested for 3 days.
              Total test time: {(thumbnailFiles.length + 1) * 3} days{" "}
              <button
                onClick={startTest}
                className="p-2 text-white bg-green-600 cursor-pointer rounded-md text-center text-xl hover:bg-gray-700 hover:text-gray-400 mb-5 font-semibold w-fit ml-3"
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
