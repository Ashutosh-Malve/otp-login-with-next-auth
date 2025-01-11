import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyOTP } from "@/lib/otp"
import { verifyPhoneOTP } from "@/lib/phoneOtp"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "otp-signin",
      name: "OTP Sign In",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        otp: { label: "One-Time Password", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.otp) {
          throw new Error("Identifier and OTP are required")
        }

        const isEmail = credentials.identifier.includes('@')
        const isValid = isEmail
          ? await verifyOTP(credentials.identifier, credentials.otp)
          : await verifyPhoneOTP(credentials.identifier, credentials.otp)

        if (isValid) {
          let user = await prisma.user.findUnique({
            where: isEmail ? { email: credentials.identifier } : { phone: credentials.identifier },
          })

          if (!user) {
            user = await prisma.user.create({
              data: isEmail ? { email: credentials.identifier } : { phone: credentials.identifier },
            })
          }

          return { id: user.id, email: user.email, phone: user.phone }
        }

        throw new Error("Invalid OTP")
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

