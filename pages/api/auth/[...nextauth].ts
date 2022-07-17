import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

async function refreshAccessToken(token: any) {
  try {
    console.log("refreshing token")
    if (!token.refreshToken) {
      throw new Error("No refresh token")
    }
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      })

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          scope:
            "openid profile email https://www.googleapis.com/auth/youtube.upload  https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly",
          prompt: "consent",
          accessType: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60, // 30 days
    // updateAge: 24 * 60 * 60, // 24 hours
  },
  // jwt: {
  //   secret: process.env.SECRET
  // },
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial Sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: Date.now() + account?.expires_at! * 1000,
          user,
        }
      }

      // Return previous token if accessToken is not expired
      // @ts-ignore
      if (Date.now() < token.accessTokenExpires) {
        // console.log('not expired', token, account)
        return token
      }
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken

      session.user = token.user as any
      session.error = token.error
      if (session.error) console.log("Session Error: ", session.error)

      return session
    },
  },
  events: {},
  debug: false,
}

export default NextAuth(authOptions)

//   callbacks: {
//     async jwt({ token, account }) {
//       if (account) {
//         token.accessToken = account.access_token
//         token.refreshToken = account.refresh_token
//       }
//       return token
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken
//       session.refreshToken = token.refreshToken
//       return session
//     },
