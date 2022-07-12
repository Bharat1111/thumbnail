import { NextApiRequest, NextApiResponse } from "next"
import { google } from "googleapis"
const service = google.youtube("v3")
import got from "got"

import { generateAuthedClient } from "../../../utils/youtubeUtils"
import {
  bufferToStream,
  stream2buffer,
  streamToBuffer,
} from "../../../utils/streamUtils"

export default async function setThumbnail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // await runMiddleware(req, res, fileUpload())
  const { videoId, accessToken, refreshToken, thumbnailUrl } = req.body

  const authedClient = generateAuthedClient({ accessToken, refreshToken })
  const fileStream = got.stream(thumbnailUrl)
  console.log("fileStream", fileStream)

  const getBuffer = await streamToBuffer(fileStream)
  console.log("fileStream", getBuffer)
  const finalStream = await bufferToStream(getBuffer)
  console.log("finalStream")

  await service.thumbnails.set({
    auth: authedClient,
    videoId,
    media: {
      mimeType: "image/png" || "image/jpeg",
      body: finalStream,
    },
  })

  res.send("Thumbnail Updated")
}
