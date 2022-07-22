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
      className="md:w-52 md:min-w-[200px] w-full h-auto"
      id="uploadForm"
      onSubmit={() => {}}
      ref={formRef}
      encType="multipart/form-data"
      method="post"
    >
      <div className="flex flex-col form-group">
        <div className="w-[200px] h-60 md:h-[140px]">
          <FileUploader
            name="video"
            types={fileTypes}
            handleChange={handleChange}
            classes="cursor-pointer w-full h-full border-[3px] rounded-2xl border-black/75 border-dashed flex flex-col justify-center items-center"
          >
            <div className="flex flex-col">
              <h4 className="text-black font-medium text-center">
                Drag & drop
                <p className="font-medium text-lg text-lime-500">
                  OR Choose file
                </p>
              </h4>
            </div>
          </FileUploader>
        </div>
      </div>
    </form>
  )
}

export default ThumbnailUploader
