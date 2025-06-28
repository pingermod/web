'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { loginAction, registerAction } from '@/app/actions/auth-actions'

interface AuthModalProps {
  isOpen: boolean
  onAuthenticated: () => void
}

export function AuthModal({ isOpen, onAuthenticated }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (formData: FormData) => {
    setIsLoading(true)
    setError('')
    
    const result = await loginAction(formData)
    
    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      onAuthenticated()
    }
    
    setIsLoading(false)
  }

  const handleRegister = async (formData: FormData) => {
    setIsLoading(true)
    setError('')
    
    const result = await registerAction(formData)
    
    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      onAuthenticated()
    }
    
    setIsLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop avec effet de blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
      
      {/* Modal */}
      <Card className="relative z-10 w-full max-w-md p-6 mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Bienvenue</h2>
          <p className="text-muted-foreground mt-2">
            Vous devez vous connecter ou créer un compte pour continuer
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-4">
            {error}
          </div>
        )}

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form action={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Mot de passe</Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form action={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Nom</Label>
                <Input
                  id="register-name"
                  name="name"
                  type="text"
                  placeholder="Votre nom"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Mot de passe</Label>
                <Input
                  id="register-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Création...' : 'Créer mon compte'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}