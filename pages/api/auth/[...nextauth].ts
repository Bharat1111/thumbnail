// import NextAuth, { NextAuthOptions } from "next-auth"
// import GoogleProvider from "next-auth/providers/google"

// // import AppleProvider from "next-auth/providers/apple"
// // import EmailProvider from "next-auth/providers/email"

// // For more information on each option (and a full list of options) go to
// // https://next-auth.js.org/configuration/options
// async function refreshAccessToken(token: any) {
//   try {
//     console.log('refreshing token')
//     if (!token.refreshToken) {
//       throw new Error('No refresh token')
//     }
//     const url =
//       "https://oauth2.googleapis.com/token?" +
//       new URLSearchParams({
//         client_id: process.env.GOOGLE_CLIENT_ID as string,
//         client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
//         grant_type: "refresh_token",
//         refresh_token: token.refreshToken,
//       })

//     const response = await fetch(url, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       method: "POST",
//     })

//     const refreshedTokens = await response.json()

//     if (!response.ok) {
//       throw refreshedTokens
//     }

//     return {
//       ...token,
//       accessToken: refreshedTokens.access_token,
//       accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
//       refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
//     }
//   } catch (error) {
//     console.log(error)

//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     }
//   }
// }

// export const authOptions: NextAuthOptions = {
//   // https://next-auth.js.org/configuration/providers/oauth
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//       authorization: {
//         params: {
//           scope:
//             "openid profile email https://www.googleapis.com/auth/youtube.upload  https://www.googleapis.com/auth/youtube.readonly",
//           prompt: "consent",
//           accessType: "offline",
//           response_type: "code",
//         },
//       },
//     }),
//   ],
//   theme: {
//     colorScheme: "light",
//   },
//   secret: process.env.SECRET,
//   session: {
//     // Choose how you want to save the user session.
//     // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
//     // If you use an `adapter` however, we default it to `"database"` instead.
//     // You can still force a JWT session by explicitly defining `"jwt"`.
//     // When using `"database"`, the session cookie will only contain a `sessionToken` value,
//     // which is used to look up the session in the database.
//     strategy: "jwt",

//     // Seconds - How long until an idle session expires and is no longer valid.
//     // maxAge: 30 * 24 * 60 * 60, // 30 days

//     // Seconds - Throttle how frequently to write to database to extend a session.
//     // Use it to limit write operations. Set to 0 to always update the database.
//     // Note: This option is ignored if using JSON Web Tokens
//     // updateAge: 24 * 60 * 60, // 24 hours
//   },
//   jwt: {
//     secret: process.env.SECRET
//   },
//   callbacks: {
//     async jwt({ token, account, user }) {
//       if (account && user) {
//         return {
//           accessToken: account.accessToken,
//           refreshToken: account.refreshToken,
//           accessTokenExpires: Date.now() + account?.expires_at! * 1000,
//           user
//         }
//       }
      
//       // Return previous token if accessToken is not expired
//       if (Date.now() < token.accessTokenExpires) {
//         console.log('not expired')
//         return token
//       }
//       return refreshAccessToken(token)
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken
//       session.refreshToken = token.refreshToken

//       session.user = token.user as any
//       session.error = token.error
//       if(session.error) console.log('Session Error: ', session.error)

//       return session
//     },
//   },
//   events: {},
//   debug: false
// }

// export default NextAuth(authOptions)


import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          scope:
            "openid profile email https://www.googleapis.com/auth/youtube.upload  https://www.googleapis.com/auth/youtube.readonly",
        },
      },
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  secret: process.env.SECRET,
  session: {
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: "jwt",

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken

      return session
    },
  }
}

export default NextAuth(authOptions)
