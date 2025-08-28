import React from 'react';
import { AuthProvider } from './components/AuthProvider';
import { EnhancedDashboard } from './components/EnhancedDashboard';

export default function App() {
  return (
    <div className="size-full">
      <AuthProvider>
        <EnhancedDashboard />
      </AuthProvider>
    </div>
  );
}