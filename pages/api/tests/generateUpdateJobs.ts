import { NextApiRequest, NextApiResponse } from "next";
import { sendJobsToQueue } from "../../../utils/fuqueue";
import { getAllVideoIds } from "../../../utils/mongo";
import { sendBlobToQueue } from "../../../utils/rabbitmq";

export default async function generateJobs(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let videoIds = await getAllVideoIds() as string[];
    // for (let videoId of (videoIds || [])) {
    //     await sendBlobToQueue(videoId).then(() => {
    //         console.log('Stored ' + videoId)
    //     });
    // }
    if (!videoIds) {
        return res.status(200).send('No videos to publish')
    }
    const response = await sendJobsToQueue(videoIds)
    console.log('Generated jobs', response)
    res.status(200).send({
        message: `${response} Published all videos`,
        videoIds
    });
}