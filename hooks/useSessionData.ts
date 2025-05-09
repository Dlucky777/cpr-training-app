import { useState, useCallback, useEffect } from 'react';
import { PressureReading, CPRSession } from '../types';

export const useSessionData = (isConnected: boolean, pressureValue: number, pressureStatus: 'low' | 'perfect' | 'high' | 'none') => {
  const [activeSession, setActiveSession] = useState<CPRSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<CPRSession[]>([]);
  const [perfectCount, setPerfectCount] = useState(0);
  const [totalReadings, setTotalReadings] = useState(0);

  // Start a new session
  const startSession = useCallback(() => {
    const newSession: CPRSession = {
      id: Date.now().toString(),
      startTime: Date.now(),
      endTime: null,
      readings: [],
      averagePressure: 0,
      perfectPressurePercentage: 0
    };
    setActiveSession(newSession);
    setPerfectCount(0);
    setTotalReadings(0);
  }, []);

  // End the current session
  const endSession = useCallback(() => {
    if (activeSession) {
      const endedSession: CPRSession = {
        ...activeSession,
        endTime: Date.now(),
        perfectPressurePercentage: totalReadings > 0 ? (perfectCount / totalReadings) * 100 : 0,
        averagePressure: activeSession.readings.length > 0 
          ? activeSession.readings.reduce((sum, reading) => sum + reading.value, 0) / activeSession.readings.length 
          : 0
      };
      
      setSessionHistory(prev => [...prev, endedSession]);
      setActiveSession(null);
    }
  }, [activeSession, perfectCount, totalReadings]);

  // Add a pressure reading to the active session
  useEffect(() => {
    if (isConnected && activeSession && pressureStatus !== 'none') {
      const newReading: PressureReading = {
        value: pressureValue,
        status: pressureStatus,
        timestamp: Date.now()
      };
      
      setActiveSession(prev => {
        if (prev) {
          return {
            ...prev,
            readings: [...prev.readings, newReading]
          };
        }
        return prev;
      });
      
      if (pressureStatus === 'perfect') {
        setPerfectCount(prev => prev + 1);
      }
      setTotalReadings(prev => prev + 1);
    }
  }, [isConnected, pressureValue, pressureStatus, activeSession]);

  // Load session history from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('cprSessionHistory');
    if (savedSessions) {
      try {
        setSessionHistory(JSON.parse(savedSessions));
      } catch (e) {
        console.error('Failed to load session history:', e);
      }
    }
  }, []);

  // Save session history to localStorage
  useEffect(() => {
    if (sessionHistory.length > 0) {
      localStorage.setItem('cprSessionHistory', JSON.stringify(sessionHistory));
    }
  }, [sessionHistory]);

  return {
    activeSession,
    sessionHistory,
    startSession,
    endSession,
    perfectPercentage: totalReadings > 0 ? (perfectCount / totalReadings) * 100 : 0
  };
};