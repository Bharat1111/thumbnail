import { NextApiRequest, NextApiResponse } from "next";
import { getAllVideoIds } from "../../../utils/mongo";
import { sendBlobToQueue } from "../../../utils/rabbitmq";

export default async function generateJobs(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let videoIds = await getAllVideoIds();
    for (let videoId of (videoIds || [])) {
        await sendBlobToQueue(videoId).then(() => {
            console.log('Stored ' + videoId)
        });
    }
    res.status(200).send("Published all jobs");
}