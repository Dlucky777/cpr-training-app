import React from 'react';
import { Play, StopCircle } from 'lucide-react';

interface SessionControlsProps {
  isSessionActive: boolean;
  isConnected: boolean;
  onStartSession: () => void;
  onEndSession: () => void;
  perfectPercentage: number;
}

const SessionControls: React.FC<SessionControlsProps> = ({
  isSessionActive,
  isConnected,
  onStartSession,
  onEndSession,
  perfectPercentage,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">CPR Session</h2>

      {isSessionActive && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Performance</span>
            <span className="font-medium">{perfectPercentage.toFixed(1)}% Perfect</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${perfectPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        {isSessionActive ? (
          <button
            onClick={onEndSession}
            className="flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            disabled={!isConnected}
          >
            <StopCircle className="h-5 w-5 mr-2" />
            End Session
          </button>
        ) : (
          <button
            onClick={onStartSession}
            className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
              isConnected
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isConnected}
          >
            <Play className="h-5 w-5 mr-2" />
            Start Session
          </button>
        )}
      </div>

      {!isConnected && (
        <p className="text-center text-gray-500 mt-4 text-sm">
          Connect to a CPR device to start a session
        </p>
      )}
    </div>
  );
};

export default SessionControls;