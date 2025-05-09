export interface BluetoothDeviceInfo {
  id: string;
  name: string;
}

export interface PressureReading {
  value: number;
  status: 'low' | 'perfect' | 'high' | 'none';
  timestamp: number;
}

export interface CPRSession {
  id: string;
  startTime: number;
  endTime: number | null;
  readings: PressureReading[];
  averagePressure: number;
  perfectPressurePercentage: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phoneNumber: string;
}

export interface UserProfile {
  name: string;
  trainingLevel: 'beginner' | 'intermediate' | 'advanced';
  completedSessions: number;
}