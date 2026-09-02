import React from 'react';
import { useLessonStore } from './store/useLessonStore';
import Header from './components/layout/Header';
import SplitPaneLayout from './components/layout/SplitPaneLayout';
import LoginPage from './components/auth/LoginPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';

const msClientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;

const msalConfig = {
  auth: {
    clientId: msClientId,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "/",
  }
};
const msalInstance = new PublicClientApplication(msalConfig);

export default function App() {
  const isAuthenticated = useLessonStore((state) => state.isAuthenticated);
  const isDarkMode = useLessonStore((state) => state.isDarkMode);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.error("Missing VITE_GOOGLE_CLIENT_ID in frontend .env file!");
  }
  if (!msClientId) {
    console.error("Missing VITE_MICROSOFT_CLIENT_ID in frontend .env file!");
  }

  const AppContent = () => {
    if (!isAuthenticated) {
      return (
        <div className={isDarkMode ? 'dark' : ''}>
          <LoginPage />
        </div>
      );
    }
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
          <Header />
          <div className="flex-1 flex overflow-hidden">
            <SplitPaneLayout />
          </div>
        </div>
      </div>
    );
  };

  return (
    <MsalProvider instance={msalInstance}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AppContent />
      </GoogleOAuthProvider>
    </MsalProvider>
  );
}