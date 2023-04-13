import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
// import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers: [
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET
        // }),
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Continue with email',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Email", type: "text", placeholder: "example@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // You need to provide your own logic here that takes the credentials


                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                const res = await fetch(`${process.env.BACKEND_API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(credentials)
                })
                const data = await res.json()

                if (data.status === 'ok') {
                    return data.user
                }
                return null
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    // callbacks: {
    //     async jwt({token, user, account}) {
    //         if (account) {
    //             token.accessToken = account.accessToken
    //             token.user = user
    //         }
    //         return token
    //     },
    //     async session({ session, token, user }) {
    //         session.accessToken = token.accessToken
    //         session.user = token.user
    //         return session
    //     }
    // },
    pages: {
        signIn: '/auth/signin',
    }

}

export default NextAuth(authOptions)
