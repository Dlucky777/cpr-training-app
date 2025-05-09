import React, { useEffect, useState } from 'react';
import BluetoothConnection from '../components/BluetoothConnection';
import TrainingMonitor from '../components/PressureMonitor';
import { useBluetooth } from '../hooks/useBluetooth';
import { useSessionData } from '../hooks/useSessionData';
import { useCompressionMetrics } from '../hooks/useCompressionMetrics';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { Heart, Menu, X } from 'lucide-react';

const Home: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if the app is running in standalone mode (installed as PWA)
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

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
      {/* Custom Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
        <button 
          className="text-gray-600 hover:text-gray-900 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="font-semibold text-lg">CPR Training</span>
        <Heart className="text-green-600" />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 p-4">
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="space-y-4">
            <a href="#" className="block text-lg">Home</a>
            <a href="#" className="block text-lg">History</a>
            <a href="#" className="block text-lg">Settings</a>
          </nav>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-4 sm:p-6">
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
            <span className="material-icons text-base">school</span>
            <span className="text-sm sm:text-base">Compression only</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="material-icons text-base">timer</span>
            <span className="text-sm sm:text-base">02:00</span>
          </div>
        </div>
        <button className="w-full max-w-xl bg-teal-700 text-white py-3 rounded-xl font-semibold text-base sm:text-lg shadow hover:bg-teal-800 transition">
          Start session
        </button>
      </div>

      {/* Install PWA Prompt */}
      {!isStandalone && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <span className="text-sm">Install app for better experience</span>
            <button 
              onClick={() => {
                // This will trigger the browser's install prompt
                const deferredPrompt = (window as any).deferredPrompt;
                if (deferredPrompt) {
                  deferredPrompt.prompt();
                }
              }}
              className="bg-teal-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Install
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;