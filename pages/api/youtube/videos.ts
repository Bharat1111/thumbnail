import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import {google} from 'googleapis'
const service = google.youtube('v3')
const OAuth2 = google.auth.OAuth2

const generateAuthedClient = ({ accessToken, refreshToken }: any) => {
    const clientSecret = process.env.GOOGLE_SECRET
    const clientId = process.env.GOOGLE_ID
    const redirectUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000/api/auth/callback/google'
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl)

    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    })

    return oauth2Client
}

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

        console.log(channelIdResponse, uploadsPlaylistId)
        // get my uploads
        let uploadsResponse = await service.playlistItems.list({
            auth: authedClient,
            part: ['snippet'],
            playlistId: uploadsPlaylistId,
            maxResults: 50
        })
        let uploads = uploadsResponse.data?.items

        res.status(200).send(uploads);
    } else {
        res.status(401).send('You are not signed in!');
    }
}