import { NextApiRequest, NextApiResponse } from "next";
import { sendBlobToQueue } from "../../../utils/rabbitmq";

export default async function publish(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let videoId = req.query.videoId as string
    await sendBlobToQueue(videoId).then(() => {
        res.status(200).send('Stored ' + videoId)
    })
}