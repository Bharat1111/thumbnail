import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import {
  getSingleDataFromMongo,
  TestBlob,
  updateSingleDataInMongo,
} from "../../../utils/mongo"

const NEXTAUTH_URL =
  process.env.NEXTAUTH_URL || "https://thumbnail-xi.vercel.app"

export default async function update(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Request received through webhook')
  const videoId = (req.body.videoId || req.query.videoId || req.body) as string
  const jobBlob: TestBlob = (await getSingleDataFromMongo(videoId)) as any

  const accessToken = jobBlob?.accessToken
  const refreshToken = jobBlob?.refreshToken

  // move to next thumbnail
  const currentThumbnail = jobBlob.currentThumbnail
  const nextThumbnail = (currentThumbnail + 1) % jobBlob?.thumbnails.length
  console.log('Updating from thumbnail ' + currentThumbnail + ' to ' + nextThumbnail)

  let nextThumbnailUrl = jobBlob?.thumbnails[nextThumbnail]

  console.log('Starting updating')
  let thumbnailUpdated = await axios.post(
    `${NEXTAUTH_URL}/api/youtube/setThumbnailFromUrl`,
    {
      videoId,
      thumbnailUrl: nextThumbnailUrl,
      accessToken,
      refreshToken,
    }
  )

  console.log('Updated Thumbnail', thumbnailUpdated)

  // update mongo
  let updateJobBlob = {
    ...jobBlob,
    currentThumbnail: nextThumbnail,
    accessToken,
    refreshToken,
  }
  console.log('going to acknowledge job', updateJobBlob)
  await updateSingleDataInMongo(updateJobBlob).then(() => {
    res.status(200).send("Thumbnail updated")
  })
}
