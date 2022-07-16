import axios from 'axios'
let QUEUE_URL = process.env.QUEUE_URL as string

export async function sendJobsToQueue(jobs: string[]) {
    try {
        let response = await axios.post(QUEUE_URL, { jobs })
        return response.data
    } catch (e) {
        console.log('error: ', e)
        return 'Failed!'
    }
}