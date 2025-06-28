'use client'

import React, { useState, useEffect } from 'react'
import { AuthModal } from './AuthModal'

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié (localStorage, cookie, etc.)
    const authStatus = localStorage.getItem('isAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    } else {
      setShowModal(true)
    }
  }, [])

  const handleAuthenticated = () => {
    setIsAuthenticated(true)
    setShowModal(false)
    localStorage.setItem('isAuthenticated', 'true')
  }

  return (
    <>
      <div className={showModal ? 'blur-sm pointer-events-none' : ''}>
        {children}
      </div>
      <AuthModal 
        isOpen={showModal} 
        onAuthenticated={handleAuthenticated}
      />
    </>
  )
}