import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Zap, Target, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const { login, googleInitialized } = useAuth();
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    // Only render Google Sign-In button after initialization is complete
    if (googleInitialized && window.google) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        renderGoogleButton();
      }, 100);
      return () => clearTimeout(timer);
    }

    // Show timeout message if Google doesn't initialize within 10 seconds
    const timeoutTimer = setTimeout(() => {
      if (!googleInitialized) {
        setShowTimeout(true);
      }
    }, 10000);

    return () => clearTimeout(timeoutTimer);
  }, [googleInitialized]);

  const renderGoogleButton = () => {
    if (!window.google) return;

    const buttonElement = document.getElementById('google-signin-button');
    if (!buttonElement) return;

    try {
      window.google.accounts.id.renderButton(
        buttonElement,
        {
          theme: 'filled_blue',
          size: 'large',
          text: 'signin_with',
          width: 280,
        }
      );
    } catch (error) {
      console.error('Error rendering Google Sign-In button:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo & Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl">
            <Zap className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl text-white mb-2">
            Affiliate Ad Studio
          </h1>
          <p className="text-blue-200 text-lg">
            AI-Powered Campaign Builder
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-blue-200 shadow-2xl">
          <CardHeader className="text-center space-y-2 pb-4">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <p className="text-sm text-gray-600">
              Sign in to access your campaigns and AI agents
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timeout Warning */}
            {showTimeout && !googleInitialized && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  Google Sign-In is taking longer than expected. Please check your internet connection or try the button below.
                </AlertDescription>
              </Alert>
            )}

            {/* Google Sign-In Button Container */}
            <div className="flex justify-center min-h-[44px]">
              {googleInitialized ? (
                <div id="google-signin-button"></div>
              ) : (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading Google Sign-In...</span>
                </div>
              )}
            </div>

            {/* Alternative: Manual login trigger */}
            <Button
              onClick={login}
              disabled={!googleInitialized}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
              size="lg"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>

            {/* Features */}
            <div className="pt-4 border-t space-y-3">
              <p className="text-xs text-gray-500 text-center mb-3">
                What you get access to:
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>11 Specialized AI Agents</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span>Complete Campaign Workflow</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>AI-Powered Insights & Chat</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-blue-200">
          Secure authentication powered by Google
        </p>
      </div>
    </div>
  );
}
