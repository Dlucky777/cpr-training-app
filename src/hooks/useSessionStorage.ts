import { useEffect } from 'react';

interface SessionData {
  timestamp: number;
  compressionRate: number;
  compressionDepth: number;
  pressureValue: number;
  pressureStatus: 'low' | 'perfect' | 'high' | 'none';
}

export function useSessionStorage(
  isConnected: boolean,
  compressionRate: number,
  compressionDepth: number,
  pressureValue: number,
  pressureStatus: 'low' | 'perfect' | 'high' | 'none'
) {
  useEffect(() => {
    if (isConnected && pressureValue > 0) {
      const sessionData: SessionData = {
        timestamp: Date.now(),
        compressionRate,
        compressionDepth,
        pressureValue,
        pressureStatus
      };

      // Get existing sessions from localStorage
      const existingSessions = localStorage.getItem('cprSessions');
      const sessions: SessionData[] = existingSessions ? JSON.parse(existingSessions) : [];

      // Add new session data
      sessions.push(sessionData);

      // Keep only the last 100 sessions to prevent localStorage from getting too full
      const recentSessions = sessions.slice(-100);

      // Save back to localStorage
      localStorage.setItem('cprSessions', JSON.stringify(recentSessions));
    }
  }, [isConnected, compressionRate, compressionDepth, pressureValue, pressureStatus]);
}

// Helper function to get all stored sessions
export function getStoredSessions(): SessionData[] {
  const sessions = localStorage.getItem('cprSessions');
  return sessions ? JSON.parse(sessions) : [];
}

// Helper function to clear all stored sessions
export function clearStoredSessions(): void {
  localStorage.removeItem('cprSessions');
} 