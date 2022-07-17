import axios from "axios"
import React, { useContext, useEffect, useState } from "react"
import UserTestsContext from "../contexts/UserTestsContext"
import { TestBlob } from "../utils/mongo"

const TestStats = ({ videoId }: { videoId: string }) => {
  const [analytics, setAnalytics] = useState<Record<string, any>>({})
  const [currentTest, setCurrentTest] = useState<TestBlob>()
  const { tests } = useContext(UserTestsContext)

  // videoId, channelId, startDate

  useEffect(() => {
    const currentTest = tests.find((test) => test.videoId === videoId)
    setCurrentTest(currentTest)
    if (!currentTest) return

    // create url search params from currentTest
    const params = new URLSearchParams()
    params.append("videoId", currentTest.videoId)
    params.append("channelId", currentTest.channelId)
    params.append("startDate", currentTest.startDate)
    //   calculate end date from testLength
    const endDate = new Date(currentTest.startDate)
    endDate.setDate(endDate.getDate() + currentTest.testLength)
    params.append("endDate", endDate.toISOString().split("T")[0])

    let partialUrl = `/api/youtube/analytics?${params.toString()}`
    console.log(partialUrl, videoId)

    if (videoId) {
      axios.get(partialUrl).then((res) => {
        console.log(res.data)
        setAnalytics(res.data)
      })
    }
  }, [tests])
  return (
    <div>
      <h1 className="font-bold text-white text-3xl">Test Stats</h1>
      {currentTest &&
        currentTest.thumbnails.map((thumbnail, idx) => {
          return (
            <div>
              <h2 className="text-white font-bold text-2xl">
                Thumbnail {idx + 1}
              </h2>
              <img src={thumbnail} width="160px" height="90px" />
            </div>
          )
        })}
      <div>
        {analytics &&
          Object.keys(analytics).map((key) => {
            return (
              <div key={key} className="text-white">
                <h2>
                  {key}: {analytics[key]}
                </h2>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default TestStats
