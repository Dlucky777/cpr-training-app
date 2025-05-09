import React from 'react';
import BluetoothConnection from '../components/BluetoothConnection';
import TrainingMonitor from '../components/PressureMonitor';
import MobileCompatibility from '../components/MobileCompatibility';
import { useBluetooth } from '../hooks/useBluetooth';
import { useSessionData } from '../hooks/useSessionData';
import { useCompressionMetrics } from '../hooks/useCompressionMetrics';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { Heart } from 'lucide-react';

const Home: React.FC = () => {
  const { 
    connectToDevice, 
    disconnectDevice, 
    isConnected, 
    isConnecting, 
    error, 
    pressureValue, 
    pressureStatus,
    isBluetoothAvailable
  } = useBluetooth();
  
  useSessionData(isConnected, pressureValue, pressureStatus);
  const { compressionRate, compressionDepth } = useCompressionMetrics(pressureValue, pressureStatus);
  
  useSessionStorage(
    isConnected,
    compressionRate,
    compressionDepth,
    pressureValue,
    pressureStatus
  );
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <MobileCompatibility />
      {/* Custom Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
        <button className="text-gray-600 hover:text-gray-900">
          <span className="material-icons">arrow_back</span>
        </button>
        <span className="font-semibold text-lg">Training</span>
        <Heart className="text-green-600" />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6 mt-6">
          <div className="flex flex-col gap-4">
            <BluetoothConnection 
              isConnected={isConnected}
              isConnecting={isConnecting}
              onConnect={connectToDevice}
              onDisconnect={disconnectDevice}
              error={error}
              isAvailable={isBluetoothAvailable}
            />
            <TrainingMonitor 
              pressureValue={pressureValue}
              pressureStatus={pressureStatus}
              isConnected={isConnected}
              compressionRate={compressionRate}
              compressionDepth={compressionDepth}
            />
          </div>
        </div>
      </main>
      {/* Footer */}
      <div className="w-full bg-white shadow-inner px-4 py-3 flex flex-col items-center gap-2">
        <div className="flex items-center justify-between w-full max-w-xl mb-2">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="material-icons text-base">timer</span>
            <span>02:00</span>
          </div>
        </div>
        <button className="w-full max-w-xl bg-teal-700 text-white py-3 rounded-xl font-semibold text-lg shadow hover:bg-teal-800 transition">
          Start session
        </button>
      </div>
    </div>
  );
};

export default Home;