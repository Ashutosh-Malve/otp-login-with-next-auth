import { NextResponse } from 'next/server'
import { generateOTP } from '@/lib/otp'
import { sendOTPEmail } from '@/lib/email'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (!existingUser) {
      await prisma.user.create({ data: { email } })
    }

    const otp = await generateOTP(email)
    await sendOTPEmail(email, otp)

    return NextResponse.json({ message: 'OTP sent successfully' })
  } catch (error) {
    console.error('Failed to generate or send OTP:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}

