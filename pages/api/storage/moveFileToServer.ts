import got from "got"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { stream2buffer } from "../../../utils/streamUtils"
import { uploadSingleFileFromBuffer } from "../../../utils/uploadFile"

export default async function saveAnalytics(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (session) {
    const fileUrl = req.query.fileUrl as string
    let fileStream = got(fileUrl, { isStream: true })
    const getBuffer = await stream2buffer(fileStream)

    const newFileUrl = await uploadSingleFileFromBuffer(getBuffer)
    res.status(200).send(newFileUrl)
  } else {
    res.status(401).send("You are not signed in!")
  }
}
