import { useState } from "react"
import { TestBlob } from "../utils/mongo"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

const MyTests = ({ tests }: { tests: TestBlob[] }) => {
  const [currentVideoId, setCurrentVideoId] = useState("")

  return (
    <>
      {tests.map((test) => (
        <a
          onClick={() => setCurrentVideoId(test.videoId)}
          className={classNames(
            currentVideoId === test.videoId
              ? "bg-gray-900 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white",
            "group flex flex-col items-center px-2 py-2 text-sm font-medium rounded-md"
          )}
          key={test.videoId}
          href={"/test/" + test.videoId}
        >
          <img
            width="210"
            height="157"
            src={`https://img.youtube.com/vi/${test.videoId}/maxresdefault.jpg`}
          />
          <span className="flex-1">{test.startDate}</span>
        </a>
      ))}
    </>
  )
}

export default MyTests
