import { NextResponse } from 'next/server'
import { generatePhoneOTP } from '@/lib/phoneOtp'
import { prisma } from '@/lib/prisma'
import twilio from 'twilio'

// Initialize Twilio client with SID and Auth Token
const twilioClient = twilio(
  process.env.TWILIO_SID,  // Your Twilio Account SID (set as environment variable)
  process.env.TWILIO_AUTH_TOKEN // Your Twilio Auth Token (set as environment variable)
)

export async function POST(req: Request) {
  try {
    const { phone } = await req.json()

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({ where: { phone } })
    if (!existingUser) {
      await prisma.user.create({ data: { phone } })
    }

    // Generate OTP
    const otp = await generatePhoneOTP(phone)

    // Send OTP via SMS using Twilio
    const message = await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,       // OTP message
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: phone,                        // Recipient's phone number
    })

    console.log(`OTP sent to ${phone}: ${otp}`)

    return NextResponse.json({ message: 'OTP sent successfully' })
  } catch (error) {
    console.error('Failed to generate or send OTP:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
