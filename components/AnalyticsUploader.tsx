import axios from "axios"
import { useContext, useEffect, useRef, useState } from "react"
import { FileUploader } from "react-drag-drop-files"
const fileTypes = ["ZIP"]
import UserTestsContext from "../contexts/UserTestsContext"
import { TestBlob } from "../utils/mongo"
import { processStats } from "../utils/statsProcessor"

const AnalyticsUploader = ({ videoId }: { videoId: string }) => {
  const [file, setFile] = useState<File | null>(null)
  const [uploadSuccesful, setUploadSuccessful] = useState(false)
  const [currentTest, setCurrentTest] = useState<TestBlob>()
  const [link, setLink] = useState(false)
  const { tests, setThumbnailStats } = useContext(UserTestsContext)

  const getAnalytics = () => {
    if (currentTest) {
      window.open(
        `https://studio.youtube.com/video/${videoId}/analytics/tab-overview/period-default/explore?entity_type=VIDEO&entity_id=${videoId}&time_period=${new Date(
          currentTest.startDate
        ).getTime()}%2C${Date.now()}&explore_type=TABLE_AND_CHART&chart_type=LINE_CHART&metric=AVERAGE_WATCH_TIME&comparison_metric=VIDEO_THUMBNAIL_IMPRESSIONS_VTR&granularity=DAY&t_metrics=VIDEO_THUMBNAIL_IMPRESSIONS_VTR&t_metrics=VIEWS&t_metrics=WATCH_TIME&t_metrics=AVERAGE_WATCH_TIME&dimension=DAY&o_column=DAY&o_direction=ANALYTICS_ORDER_DIRECTION_DESC`,
        "_blank"
      )
    }
    setLink(true)
  }

  useEffect(() => {
    console.log("tests", tests)
    const currentTest = tests.find((test) => test.videoId === videoId)
    setCurrentTest(currentTest)
    if (!currentTest) {
      console.log("Could not find test for videoId", videoId)
      return
    }
  }, [tests])

  const handleChange = (newFile: File) => {
    console.log("file dropped", newFile)
    setFile(newFile)
  }
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (file && !uploadSuccesful) {
      const formData = new FormData()
      formData.append("zip", file)
      axios
        .post("https://igisa.bitch.de/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {})
      // console.log("saving analytics", res)
      let analyticsArray = [
        {
          Date: "2022-07-19",
          "Impressions click-through rate (%)": "0",
          Views: "2",
          "Watch time (hours)": "0.0097",
          "Average view duration": "0:00:17",
        },
        {
          Date: "2022-07-18",
          "Impressions click-through rate (%)": "33.33",
          Views: "4",
          "Watch time (hours)": "0.0426",
          "Average view duration": "0:00:38",
        },
        {
          Date: "2022-07-17",
          "Impressions click-through rate (%)": "0",
          Views: "3",
          "Watch time (hours)": "0.0617",
          "Average view duration": "0:01:14",
        },
      ]
      let analyticsByDate: Record<string, any> = {}
      analyticsArray.forEach((singleDateAnalytics: Record<string, any>) => {
        let date = (singleDateAnalytics.date ||
          singleDateAnalytics.Date) as string
        analyticsByDate[date] = singleDateAnalytics
      })

      // console.log("analyticsByDate", analyticsByDate)
      axios
        .post("/api/storage/saveAnalytics", {
          videoId,
          analytics: analyticsByDate,
        })
        .then((res) => {
          alert("Anaytics Uploaded")
          setUploadSuccessful(true)

          if (currentTest) {
            processStats(currentTest, analyticsByDate).then((statsToUse) => {
              setThumbnailStats(statsToUse)
              console.log("statsToUse", statsToUse)
            })
          }
          // console.log("analytics saved", res)
        })
        .catch((err) => console.log("error saving analytics", err))
        // })
        .catch((err) => console.log(err))
    }
  }, [file])

  return (
    <div>
      {!link && (
        <div
          onClick={getAnalytics}
          className="pt-2 w-48 cursor-pointer text-white m-3"
        >
          <h1 className="p-2 bg-green-600 cursor-pointer rounded-md text-center text-xl hover:bg-gray-700 hover:text-gray-400 font-semibold">
            Get Analytics
          </h1>
        </div>
      )}
      {link && !uploadSuccesful && (
        <form
          className="md:w-80 md:min-w-[320px] w-full h-auto ml-3 p-3"
          id="uploadForm"
          onSubmit={() => {}}
          ref={formRef}
          encType="multipart/form-data"
          method="post"
        >
          <div className="flex flex-col form-group justify-center h-full">
            <div className="w-full h-60 md:h-[208px]">
              <FileUploader
                name="video"
                types={fileTypes}
                handleChange={handleChange}
                classes="cursor-pointer w-full h-full border-8 rounded-2xl border-white border-dashed flex flex-col justify-center items-center hover:bg-white/5 transition-colors duration-300"
              >
                {!file ? (
                  <>
                    <h4 className="mt-5 text-white font-bold text-xl">
                      Drag & drop analytics
                    </h4>
                    <p className="mt-12 font-bold text-sm text-lime-500">
                      Browse on your device
                    </p>
                  </>
                ) : (
                  <div className="text-white font-bold text-xl">
                    Loading analytics...
                  </div>
                )}
              </FileUploader>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default AnalyticsUploader
