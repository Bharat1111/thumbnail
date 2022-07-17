import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import {google} from 'googleapis'
const service = google.youtube('v3')

import { generateAuthedClient } from "../../../utils/youtubeUtils";

export default async function videos(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    if (session) {
        let authedClient = generateAuthedClient(session)
        // get my channel id
        let channelIdResponse = await service.channels.list({
            auth: authedClient,
            part: ['id'],
            mine: true
        })
        let channelId = channelIdResponse.data?.items?.[0]?.id
        
        console.log('channelId', channelId)
        // return channelId
        res.status(200).send({ channelId });
    } else {
        res.status(401).send('You are not signed in!');
    }
}