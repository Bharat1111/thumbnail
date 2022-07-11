import Image from "next/image"
import { useContext } from "react"
import ThumbnailSelectionContext from '../contexts/ThumbnailSelectionContext'

const UploadedThumbnailDisplayAndRemoval = () => {
    const { thumbnailFiles, setThumbnailFiles } = useContext(ThumbnailSelectionContext)

    return (
        <div className='flex flex-row justify-start'>
            {thumbnailFiles?.map((file, index) => {
                return (
                    <div key={index} className='relative m-3'>
                        <button className="absolute right-0 mt-[-10px] z-10" onClick={() => setThumbnailFiles(thumbnailFiles.filter((_, i) => i !== index))}>
                            <span className="text-black font-bold text-3xl">&times;</span>
                        </button>
                        <Image src={URL.createObjectURL(file)} alt="thumbnail" width={320} height={180} />
                    </div>
                )
            })}
        </div>
    )
}

export default UploadedThumbnailDisplayAndRemoval