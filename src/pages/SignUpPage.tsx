import React from 'react'
import { SignUp } from '@clerk/clerk-react'

const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Utwórz konto w Paleta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Zacznij analizować produkty z AI już dziś
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignUp 
            routing="hash"
            signInUrl="/#/sign-in"
            afterSignUpUrl="/#/dashboard"
          />
        </div>
      </div>
    </div>
  )
}

export default SignUpPage

