import { NextResponse } from 'next/server'
import { verifyPhoneOTP } from '@/lib/phoneOtp'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json()

    if (!phone || !otp) {
      return NextResponse.json({ error: 'Phone number and OTP are required' }, { status: 400 })
    }

    const isValid = await verifyPhoneOTP(phone, otp)

    if (isValid) {
      await prisma.user.update({
        where: { phone },
        data: { phoneVerified: new Date() },
      })
      return NextResponse.json({ message: 'Phone number verified successfully' })
    } else {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }
  } catch (error) {
    console.error('Failed to verify phone OTP:', error)
    return NextResponse.json({ error: 'Failed to verify phone OTP' }, { status: 500 })
  }
}

