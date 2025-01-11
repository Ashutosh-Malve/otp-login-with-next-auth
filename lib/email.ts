import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOTPEmail(email: string, otp: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: 'Your One-Time Password',
      html: `
        <h1>Your One-Time Password</h1>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      `
    })

    if (error) {
      console.error('Failed to send email:', error)
      throw new Error('Failed to send OTP email')
    }

    return data
  } catch (error) {
    console.error('Failed to send email:', error)
    throw new Error('Failed to send OTP email')
  }
}

