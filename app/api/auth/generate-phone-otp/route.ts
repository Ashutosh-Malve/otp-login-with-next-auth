import { NextResponse } from 'next/server'
import { generatePhoneOTP } from '@/lib/phoneOtp'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { phone } = await req.json()

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { phone } })
    if (!existingUser) {
      await prisma.user.create({ data: { phone } })
    }

    const otp = await generatePhoneOTP(phone)
    
    // TODO: Implement SMS sending logic here
    console.log(`OTP for ${phone}: ${otp}`)

    return NextResponse.json({ message: 'OTP sent successfully' })
  } catch (error) {
    console.error('Failed to generate or send OTP:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}

