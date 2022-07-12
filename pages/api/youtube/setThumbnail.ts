import { NextApiRequest, NextApiResponse } from "next";
import {google} from 'googleapis'
import { getSession } from "next-auth/react";
const service = google.youtube('v3')
import Formidable from 'formidable'

import { generateAuthedClient } from "../../../utils/youtubeUtils";
import { bufferToStream } from "../../../utils/streamUtils";
import { PassThrough } from "stream";

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
    let videoId = req.query.videoId as string

    // We'll store all the data inside this array
    let pass = new PassThrough()
    let fileBuffer: Buffer = Buffer.from('')

    // @ts-ignore
    pass.data = []
    pass._write = function (chunk: any, encoding: any, next: any) {
        console.log('data written')
        // @ts-ignore
        pass.data.push(chunk)
        if (next) next()
    }

    pass.on('finish', function () {
        console.log('finished')

        // @ts-ignore
        fileBuffer = Buffer.concat(pass.data)
        console.log('finished getting data')
    })

    pass.on('error', function (err: any) {
        console.log('error', err)
    })

    const session = await getSession({ req })
    console.log('starting to get form')

    const data = await new Promise((resolve, reject) => {
        const form = new Formidable.IncomingForm()
        form.parse(req, (err: any, fields: any, files: any) => {
            if (err) {
                return reject(err)
            }
            resolve({ fields, files })
        })
    })

    console.log('data prepped')

    if (session) {
        const authedClient = generateAuthedClient(session)
        service.thumbnails.set({
            auth: authedClient,
            videoId: '',
            media: {
                mimeType: 'image/jpeg' || 'image/png',
                body: bufferToStream(fileBuffer)
            }
        })

        res.send('Thumbnail Updated')
    } else {
        res.send('You are not signed in!')
    }
}