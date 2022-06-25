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
            part: ['contentDetails'],
            mine: true
        })

        let uploadsPlaylistId = channelIdResponse.data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads

        // get my uploads
        let uploadsResponse = await service.playlistItems.list({
            auth: authedClient,
            part: ['snippet'],
            playlistId: uploadsPlaylistId,
            maxResults: 50
        })
        let uploads = uploadsResponse.data?.items

        // get all video info
        let videoIds = uploads?.map(item => item.snippet?.resourceId?.videoId) as string[]

        let videoResponse = await service.videos.list({
            auth: authedClient,
            part: ['statistics'],
            id: videoIds,
            maxResults: 50
        })

        let videoStats = videoResponse.data?.items
        res.status(200).send(videoStats);
    } else {
        res.status(401).send('You are not signed in!');
    }
}