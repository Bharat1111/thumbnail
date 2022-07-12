import { useState } from "react"
import UploadedThumbnailDisplayAndRemoval from "../components/ThumbnailDisplayAndRemoval"
import ThumbnailUploader from "../components/ThumbnailUploader"
import VideoSelectionList, {
  YoutubeVideoBlob,
} from "../components/videoSelectionList"
import ThumbnailSelectionContext from "../contexts/ThumbnailSelectionContext"
import uploadSingleFile from "../utils/uploadFile"

const selectVideo = () => {
  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideoBlob | null>(null)
  const [thumbnailFiles, setThumbnailFiles] = useState<File[]>([])
  const [testLength, setTestLength] = useState<number>(0)

  const startTest = () => {
    setTestLength(thumbnailFiles.length)
    let formData = new FormData()
    let fileUploads = thumbnailFiles.map(file => {
      return uploadSingleFile(file)
      // formData.append(`thumbnail[]`, file)
    })
    Promise.all(fileUploads).then(results => {
      // post to DB
      console.log('results', results)
    })
  }

  return (
    <ThumbnailSelectionContext.Provider
      value={{ selectedVideo, setSelectedVideo, thumbnailFiles, setThumbnailFiles, testLength, setTestLength }}
    >
      <div className={`bg-gray-800 flex flex-col min-h-screen`}>
        <main className={`flex flex-col justify-center flex-1 py-5`}>
          <h1 className='pb-8 font-bold text-3xl text-white pl-3'>Select Video to Thumbnail test</h1>
          <VideoSelectionList />
          <h1 className='py-8 font-bold text-3xl text-white pl-3'>Drop any number of Thumbnails</h1>
          <div className="flex flex-row justify-start pl-3 pb-8">
            <ThumbnailUploader />
            <UploadedThumbnailDisplayAndRemoval />
          </div>
          <p className="text-white text-xl pl-3 pb-4">Each thumbnail (including the original) will be tested for 3 days. Total test time: {(thumbnailFiles.length + 1) * 3} days <button onClick={startTest} className="text-white ml-3 text-xl bg-blue-500 w-24">Start test</button></p>
        </main>
      </div>
    </ThumbnailSelectionContext.Provider>
  )
}

export default selectVideo
