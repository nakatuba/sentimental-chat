import NextAuth from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

async function verifyAccessToken(token: JWT) {
  const res = await fetch(`${process.env.BACKEND_HOST}/api/auth/jwt/verify/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: token.accessToken }),
  })

  return res.ok
}

async function refreshAccessToken(token: JWT) {
  const res = await fetch(`${process.env.BACKEND_HOST}/api/auth/jwt/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: token.refreshToken }),
  })
  const { access } = await res.json()

  return {
    accessToken: access,
    refreshToken: token.refreshToken,
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        username: { type: 'text' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.BACKEND_HOST}/api/auth/jwt/create/`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          }
        )
        const user = await res.json()

        if (res.ok && user) {
          return user
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          accessToken: user.access,
          refreshToken: user.refresh,
        }
      }

      if (await verifyAccessToken(token)) {
        return token
      }

      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    },
  },
})
