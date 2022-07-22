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
          <main className={`ml-16 flex flex-col flex-1 py-5`}>
            <h1 className="pb-5 font-bold text-3xl text-white">
              Start a new test
            </h1>
            <VideoSelectionList />

            <div className="pt-5 w-[95%] flex flex-row justify-between">
              <div className="p-2 pt-3 w-[71%] rounded-xl bg-[#FFEFE2]">
                <div className="flex flex-row">
                  <div className="font-bold flex items-center justify-center text-3xl w-14 h-14 bg-[#F0D2B9] rounded-full">
                    <span className="mt-[-3px]">2</span>
                  </div>
                  <div className="flex flex-col pl-2 w-[90%]">
                    <h1 className="pb-6 font-medium text-3xl text-black">
                      Upload Thumbnail(s)
                    </h1>
                    <div className="flex flex-row justify-start">
                      <div className="flex flex-col">
                        <div className="flex flex-row gap-x-2">
                          <ThumbnailUploader />
                          <UploadedThumbnailDisplayAndRemoval />
                        </div>
                        <div className="pt-4 font-normal text-lg">
                          Upload up to 10. Each thumbnail will run against
                          original
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-3 p-2 text-black w-[27%] rounded-xl bg-[#EFFcEF]">
                <div className="flex flex-row">
                  <div className="font-bold flex items-center justify-center text-3xl w-14 h-14 bg-[#C5E1C5] rounded-full">
                    <span className="mt-[-3px]">3</span>
                  </div>
                  <div className="flex flex-col pl-3 w-[80%]">
                    <h1 className="text-3xl pb-6 font-medium">Run Test</h1>
                    <p className="text-md">
                      Each thumbnail including the original will be tested for 3
                      days.
                    </p>
                    <p className="text-md">
                      Total test time: {(thumbnailFiles.length + 1) * 3}
                    </p>
                    <button
                      onClick={startTest}
                      className="p-2 bg-green-600 cursor-pointer rounded-md text-center text-md hover:bg-gray-700 hover:text-white mb-5 font-medium w-fit"
                    >
                      Start test
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </Layout>
    </ThumbnailSelectionContext.Provider>
  )
}

export default selectVideo
