import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { storeSingleDataInMongo } from "../../../utils/mongo";

export default async function saveAnalytics(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req })
    const dataToStore = req.body
    if (session) {
        await storeSingleDataInMongo(dataToStore, 'analytics').then(() => {
            console.log('stored analytics')
            res.status(200).send('Data stored')
        })
    } else {
        res.status(401).send('You are not signed in!')
    }
}