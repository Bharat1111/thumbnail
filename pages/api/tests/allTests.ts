import { NextApiRequest, NextApiResponse } from "next"

import { getAllTestsForChannel } from "../../../utils/mongo"

export default async function videos(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { channelId } = req.query
  console.log("request comes")
  const tests = await getAllTestsForChannel(channelId as string)

  return res.status(200).send({ tests })
}
