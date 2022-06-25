import { NextApiRequest, NextApiResponse } from "next";
import {google} from 'googleapis'
import { getSession } from "next-auth/react";
import fileUpload from 'express-fileupload';
const service = google.youtube('v3')

import { generateAuthedClient } from "../../../utils/youtubeUtils";
import { bufferToStream } from "../../../utils/streamUtils";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "10mb"
        }
    }
}

// function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
//     return new Promise((resolve, reject) => {
//         fn(req, res, (result: any) => {
//             if (result instanceof Error) {
//                 return reject(result);
//             }

//             return resolve(result);
//         })
//     })
// }

export default async function setThumbnail(req: NextApiRequest, res: NextApiResponse) {
    // await runMiddleware(req, res, fileUpload())
    const session = await getSession({ req })

    if (session) {
        const authedClient = generateAuthedClient(session)
        service.thumbnails.set({
            auth: authedClient,
            videoId: '',
            media: {
                mimeType: 'image/jpeg' || 'image/png',
                // @ts-ignore
                body: bufferToStream(req.body)
            }
        })

        res.send('you are signed in')
    } else {
        res.send('You are not signed in!')
    }
}