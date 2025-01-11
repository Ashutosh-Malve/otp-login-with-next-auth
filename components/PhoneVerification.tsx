'use client'

import { useState } from 'react'

interface PhoneVerificationProps {
  onVerificationComplete: (isVerified: boolean) => void
}

export function PhoneVerification({ onVerificationComplete }: PhoneVerificationProps) {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('phone')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/generate-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })

      if (response.ok) {
        setStep('otp')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to send OTP')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      })

      if (response.ok) {
        onVerificationComplete(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Invalid OTP')
        onVerificationComplete(false)
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
      onVerificationComplete(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4">
      {step === 'phone' ? (
        <form onSubmit={handlePhoneSubmit}>
          <div>
            <label className="block" htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="flex items-baseline justify-between">
            <button 
              type="submit" 
              className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <div>
            <label className="block" htmlFor="otp">One-Time Password</label>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <div className="flex items-baseline justify-between">
            <button 
              type="submit" 
              className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  )
}

