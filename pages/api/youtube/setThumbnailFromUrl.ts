import { NextApiRequest, NextApiResponse } from "next"
import { google } from "googleapis"
const service = google.youtube("v3")
import got from "got"

import { generateAuthedClient } from "../../../utils/youtubeUtils"
import {
  bufferToStream,
  streamToBuffer,
} from "../../../utils/streamUtils"

export default async function setThumbnail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // await runMiddleware(req, res, fileUpload())
  const { videoId, accessToken, refreshToken, thumbnailUrl } = req.body

  const authedClient = generateAuthedClient({ accessToken, refreshToken })
  const fileStream = got(thumbnailUrl, { isStream: true })

  const getBuffer = await streamToBuffer(fileStream)
  const finalStream = await bufferToStream(getBuffer)

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
