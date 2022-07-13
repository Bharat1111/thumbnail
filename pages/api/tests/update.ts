import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { getSingleDataFromMongo, TestBlob, updateSingleDataInMongo } from "../../../utils/mongo"

export default async function update(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const videoId = (req.body.videoId || req.query.videoId || req.body) as string
  const jobBlob: TestBlob = (await getSingleDataFromMongo(videoId)) as any

  const accessToken = jobBlob?.accessToken
  const refreshToken = jobBlob?.refreshToken

  // move to next thumbnail
  const currentThumbnail = jobBlob.currentThumbnail
  const nextThumbnail = (currentThumbnail + 1) % jobBlob?.thumbnails.length

  let nextThumbnailUrl = jobBlob?.thumbnails[nextThumbnail]

  let thumbnailUpdated = await axios.post("http://localhost:3000/api/youtube/setThumbnailFromUrl", {
    videoId,
    thumbnailUrl: nextThumbnailUrl,
    accessToken,
    refreshToken,
  })

  // update mongo
  let updateJobBlob = {
    ...jobBlob,
    currentThumbnail: nextThumbnail,
    accessToken,
    refreshToken,
    }
    await updateSingleDataInMongo(updateJobBlob).then(() => {
        res.status(200).send('Thumbnail updated')
    })
}
