import {google} from 'googleapis'
const OAuth2 = google.auth.OAuth2

export const generateAuthedClient = ({ accessToken, refreshToken }: any) => {
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