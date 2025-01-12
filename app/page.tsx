'use client'
import { PhoneVerification } from '@/components/PhoneVerification'

export default function SomeForm() {
  const handleVerificationComplete = (isVerified: boolean) => {
    if (isVerified) {
      console.log('Phone number verified successfully')
      // Proceed with your form submission or next steps
    } else {
      console.log('Phone number verification failed')
      // Handle the failure case
    }
  }

  return (
    <> 
    <form>
      {/* Other form fields */}
      <PhoneVerification onVerificationComplete={handleVerificationComplete} />
      {/* Rest of your form */}
    </form></>
  )
}