import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { google } from "googleapis"
var service = google.youtubeAnalytics("v2")

import { generateAuthedClient } from "../../../utils/youtubeUtils"

const metrics = [
  "views",
  "estimatedMinutesWatched",
  "averageViewDuration",
  "averageViewPercentage",
  //   "annotationClickThroughRate",
  //   "annotationCloseRate",
  //   "annotationCloses",
  //   "annotationImpressions",
  //   "annotationClickableImpressions",
  //   "annotationClosableImpressions",
  //   "annotationClicks",
  //   "cardClickRate",
  //   "cardTeaserClickRate",
  //   "cardImpressions",
  //   "cardTeaserImpressions",
]

export default async function analytics(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const videoId = req.query.videoId as string
  const channelId = req.query.channelId as string
  const startDate = req.query.startDate as string
  const endDate = req.query.endDate as string
  // console.log(channelId, videoId, startDate)
  const session = await getSession({ req })
  if (session) {
    let authedClient = generateAuthedClient(session)
    try {
      let channelIdResponse = await service.reports.query({
        auth: authedClient,
        ids: `channel==${channelId}`,
        metrics: metrics.toString(),
        startDate: startDate,
        endDate: endDate,
        filters: `video==${videoId}`,
      })

      console.log("channelIdResponse", channelIdResponse.data)
      let columnHeaders = channelIdResponse.data?.columnHeaders
      let rows = channelIdResponse.data?.rows
      let jsonToReturn: Record<string, any> = {}
      if (!columnHeaders) {
        res.status(500).send("error")
        return
      }
      if (!rows) {
        res.status(500).send("error")
        return
      }
      //   if (rows.length === 0) {
      //     res.status(204).end()
      //     return
      //   }

      for (let i = 0; i < columnHeaders.length; i++) {
        jsonToReturn[columnHeaders[i].name as string] = 0
      }

      res.status(200).send(jsonToReturn)
    } catch (error) {
      res.status(500).send(`error, ${error}`)
    }
  } else {
    res.status(401).send("You are not signed in!")
  }
}
