'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function SignInForm() {
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('identifier')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const isEmail = identifier.includes('@')

  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const endpoint = isEmail ? '/api/auth/generate-otp' : '/api/auth/generate-phone-otp'
      const body = isEmail ? { email: identifier } : { phone: identifier }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
      const result = await signIn('otp-signin', {
        identifier,
        otp,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4">
      {step === 'identifier' ? (
        <form onSubmit={handleIdentifierSubmit}>
          <div>
            <label className="block" htmlFor="identifier">Email or Phone Number</label>
            <input
              type="text"
              placeholder="Enter your email or phone number"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  )
}

