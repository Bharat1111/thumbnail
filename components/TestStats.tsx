import axios from "axios"
import React, { useContext, useEffect, useState } from "react"
import UserTestsContext from "../contexts/UserTestsContext"
import { TestBlob } from "../utils/mongo"
import SingleTestStat from "./SingleTestStat"

const analyticsNames: Record<string, string> = {
  views: "Views",
  estimatedMinutesWatched: "Minutes Watched",
  averageViewDuration: "Average View Duration",
  averageViewPercentage: "Average View Percentage",
}

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
    <div className="flex flex-col gap-5 px-3 m-4">
      <h1 className="font-bold text-white text-3xl">Test Stats</h1>
      {currentTest &&
        currentTest.thumbnails.map((thumbnail, thumbnailIndex) => {
          return (
            <div className="flex flex-row gap-5 bg-gray-700 p-4 rounded-xl">
              <img src={thumbnail} width="160px" height="90px" />
              {analytics &&
                Object.keys(analytics).map((key) => {
                  return (
                    <SingleTestStat
                      key={key}
                      rank={thumbnailIndex + 1}
                      name={analyticsNames[key]}
                      stat={analytics[key]}
                    />
                  )
                })}
            </div>
          )
        })}
      <div></div>
    </div>
  )
}

export default TestStats
