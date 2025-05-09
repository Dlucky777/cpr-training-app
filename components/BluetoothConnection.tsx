import React from 'react';
import { Bluetooth, BluetoothOff, Loader } from 'lucide-react';

interface BluetoothConnectionProps {
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  error: string | null;
  isAvailable: boolean;
}

const BluetoothConnection: React.FC<BluetoothConnectionProps> = ({
  isConnected,
  isConnecting,
  onConnect,
  onDisconnect,
  error,
  isAvailable
}) => {
  if (!isAvailable) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex items-center">
          <BluetoothOff className="h-6 w-6 text-yellow-500 mr-3" />
          <p className="text-yellow-700">
            Bluetooth is not available in this browser. Please try using a different browser like Chrome.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Device Connection</h2>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          {isConnected ? (
            <div className="flex items-center text-green-600">
              <Bluetooth className="h-6 w-6 mr-2" />
              <span className="font-medium">Connected to CPR Device</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-600">
              <BluetoothOff className="h-6 w-6 mr-2" />
              <span>Not connected</span>
            </div>
          )}
        </div>
        
        <div>
          {isConnected ? (
            <button
              onClick={onDisconnect}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isConnecting 
                  ? 'bg-blue-100 text-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isConnecting ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Connecting...
                </>
              ) : (
                'Connect to Device'
              )}
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default BluetoothConnection;