import Image from "next/image"
import { useContext } from "react"
import ThumbnailSelectionContext from "../contexts/ThumbnailSelectionContext"

const UploadedThumbnailDisplayAndRemoval = () => {
  const { thumbnailFiles, setThumbnailFiles } = useContext(
    ThumbnailSelectionContext
  )

  const getImageWidth = (numThumbnails: number) => {
    if (numThumbnails <= 2) return "200"
    if (numThumbnails <= 3) return "145"
    else if (numThumbnails <= 6) return "130"
    else return "83"
  }

  const getImageHeight = (numThumbnails: number) => {
    if (numThumbnails <= 2) return "110"
    if (numThumbnails <= 3) return "95"
    else if (numThumbnails <= 6) return "60"
    else return "60"
  }

  return (
    <div className="flex flex-row justify-start min-w-[73%] flex-wrap items-center overflow-x-auto gap-2">
      {thumbnailFiles?.map((file, index) => {
        return (
          <div key={index} className="relative">
            <button
              className="absolute right-0 mt-[-10px] z-10"
              onClick={() =>
                setThumbnailFiles(thumbnailFiles.filter((_, i) => i !== index))
              }
            >
              <span className="text-black font-bold text-3xl">&times;</span>
            </button>
            <Image
              src={URL.createObjectURL(file)}
              alt="thumbnail"
              width={getImageWidth(thumbnailFiles.length)}
              height={getImageHeight(thumbnailFiles.length)}
            />
          </div>
        )
      })}
    </div>
  )
}

export default UploadedThumbnailDisplayAndRemoval
