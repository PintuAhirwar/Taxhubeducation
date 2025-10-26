import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

const handler = NextAuth({
  providers: [
    // Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Manual Login (via Django API)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await axios.post("http://localhost:8000/api/auth/login/", {
            email: credentials.email,
            password: credentials.password
          })

          if (res.data && res.data.key) {
            return { 
              id: res.data.user.id,
              email: res.data.user.email,
              name: res.data.user.name,
              token: res.data.key
            }
          }
          return null
        } catch (error) {
          console.error("Login failed", error.response?.data)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    }
  }
})

export { handler as GET, handler as POST }
