import { randomInt } from 'crypto'
import { prisma } from './prisma'

const OTP_EXPIRATION = 10 * 60 * 1000 // 10 minutes

export async function generatePhoneOTP(phone: string): Promise<string> {
  const otp = randomInt(100000, 999999).toString()
  const expires = new Date(Date.now() + OTP_EXPIRATION)

  await prisma.verificationToken.create({
    data: {
      identifier: phone,
      token: otp,
      expires,
    },
  })

  return otp
}

export async function verifyPhoneOTP(phone: string, otp: string): Promise<boolean> {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: phone,
        token: otp,
      },
    },
  })

  if (!verificationToken) {
    return false
  }

  if (new Date() > verificationToken.expires) {
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: phone, token: otp } },
    })
    return false
  }

  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: phone, token: otp } },
  })

  return true
}

