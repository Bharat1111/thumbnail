import Link from "next/link"
import { useState } from "react"
import { TestBlob } from "../utils/mongo"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

const MyTests = ({ tests }: { tests: TestBlob[] }) => {
  const [currentVideoId, setCurrentVideoId] = useState("")

  return (
    <>
      {tests.map((test, idx) => (
        <Link href={"/test/" + test.videoId} key={idx}>
          <a
            onClick={() => setCurrentVideoId(test.videoId)}
            className={classNames(
              currentVideoId === test.videoId
                ? "bg-gray-900 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white",
              "group flex flex-col items-center p-2 text-sm font-medium rounded-md"
            )}
          >
            <img
              width="110"
              height="75"
              src={`https://img.youtube.com/vi/${test.videoId}/0.jpg`}
            />
            <span className="flex-1 text-xs">Started {test.startDate}</span>
          </a>
        </Link>
      ))}
    </>
  )
}

export default MyTests
