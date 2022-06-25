import { useState } from "react"

export default function BasicUpload() {
  const [file, setFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setFile(files[0])
    }
  }

  const handleUpload = () => {
    const formData = new FormData()
    setFile(file)
    console.log(file)
    formData.append("file", file as Blob)
    fetch("/api/youtube/setThumbnail", {
      method: "POST",
      body: formData,
    })
  }

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  )
}
