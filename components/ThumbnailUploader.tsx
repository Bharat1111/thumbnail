import { useContext, useRef, useState } from "react"
import { FileUploader } from "react-drag-drop-files"
const fileTypes = ["PNG", "JPG", "JPEG"]
import ThumnailSelectionContext from "../contexts/ThumbnailSelectionContext"

const ThumbnailUploader = () => {
  const { thumbnailFiles, setThumbnailFiles } = useContext(
    ThumnailSelectionContext
  )

  const handleChange = (file: File) => {
    console.log("file dropped", file)
    setThumbnailFiles([file, ...thumbnailFiles!])
    console.log(thumbnailFiles)
  }
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      className="md:w-1/2 w-full h-auto"
      id="uploadForm"
      onSubmit={() => {}}
      ref={formRef}
      encType="multipart/form-data"
      method="post"
    >
      <div className="flex form-group justify-center h-full">
        <div className="w-full h-60 md:h-80">
          <FileUploader
            name="video"
            types={fileTypes}
            handleChange={handleChange}
            classes="cursor-pointer w-1/2 h-full border-8 rounded-2xl border-white border-dashed flex flex-col justify-center items-center hover:bg-white/5 transition-colors duration-300"
          >
            {thumbnailFiles?.length === 0 ? (
              <>
                <h4 className="mt-5 text-white font-bold text-xl">
                  Drag & drop a thumbnail
                </h4>
                <p className="mt-12 font-bold text-sm text-lime-500">
                  Browse on your device
                </p>
              </>
            ) : (
              "Image Uploaded"
            )}
          </FileUploader>
        </div>
      </div>
    </form>
  )
}

export default ThumbnailUploader
