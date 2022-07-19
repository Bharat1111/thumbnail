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
            part: ['snippet', 'status'],
            id: videoIds,
            maxResults: 50
        })
// console.log(uploads)
        let videoStats = videoResponse.data?.items
        // filter out videos that are private
        let publicVideos = videoStats?.filter(item => item.status?.privacyStatus === 'public')
        res.status(200).send(publicVideos);
    } else {
        res.status(401).send('You are not signed in!');
    }
}