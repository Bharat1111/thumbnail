import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { storeSingleDataInMongo } from "../../../utils/mongo"

export default async function setThumbnail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const dataToStore = {
    ...req.body,
    accessToken: session?.accessToken,
    refreshToken: session?.refreshToken,
  }

  if (session) {
    storeSingleDataInMongo(dataToStore, "allTests").then(() => {
      res.status(200).send("Data stored")
    })
  } else {
    res.status(401).send("You are not signed in!")
  }
}
