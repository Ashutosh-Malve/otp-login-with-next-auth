'use client'

import { useSearchParams } from 'next/navigation'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center text-red-600">Authentication Error</h3>
        <p className="mt-4 text-center">{error || 'An unknown error occurred'}</p>
      </div>
    </div>
  )
}

