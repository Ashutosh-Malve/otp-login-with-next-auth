import { randomBytes } from 'crypto'
import { prisma } from './prisma'

const OTP_EXPIRATION = 10 * 60 * 1000 // 10 minutes

export async function generateOTP(email: string): Promise<string> {
  const otp = randomBytes(3).toString('hex').toUpperCase()
  const expires = new Date(Date.now() + OTP_EXPIRATION)

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: otp,
      expires,
    },
  })

  return otp
}

export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: email,
        token: otp,
      },
    },
  })

  if (!verificationToken) {
    return false
  }

  if (new Date() > verificationToken.expires) {
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token: otp } },
    })
    return false
  }

  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: email, token: otp } },
  })

  return true
}

