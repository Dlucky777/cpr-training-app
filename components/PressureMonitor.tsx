import React from 'react';

interface TrainingMonitorProps {
  pressureValue: number;
  pressureStatus: 'low' | 'perfect' | 'high' | 'none';
  isConnected: boolean;
  compressionRate: number;
  compressionDepth: number; // 1: Low, 2: Perfect, 3: High
}

// Helper functions for gauge and bar
const getNeedleAngle = (compressionRate: number) => {
  // Map compressionRate (0-200) to angle (-90 to 90 degrees)
  const min = 0, max = 200;
  const clamped = Math.max(min, Math.min(max, compressionRate));
  return ((clamped / (max - min)) * 180) - 90;
};

const getBarFill = (compressionDepth: number) => {
  // Map compressionDepth (1,2,3) to fill percentage (low=0.33, perfect=0.66, high=1)
  if (compressionDepth === 1) return 0.33;
  if (compressionDepth === 2) return 0.66;
  if (compressionDepth === 3) return 1;
  return 0;
};

const TrainingMonitor: React.FC<TrainingMonitorProps> = ({
  pressureValue,
  pressureStatus,
  isConnected,
  compressionRate,
  compressionDepth
}) => {
  if (!isConnected) {
    return (
      <div className="bg-gray-100 rounded-lg shadow-md p-6 text-center h-64 flex flex-col items-center justify-center">
        <div className="text-gray-400 text-xl mb-4">Not connected to device</div>
        <p className="text-gray-500">Connect to your CPR device to see pressure readings</p>
      </div>
    );
  }

  // SVG colors
  const green = '#4CAF50';
  const dark = '#38606b';
  const light = '#b2dfdb';

  // Gauge needle angle (rate)
  const angle = getNeedleAngle(compressionRate);
  // Compression bar fill (depth)
  const fill = getBarFill(compressionDepth);

  // Depth label
  const depthLabel =
    compressionDepth === 1 ? 'Low' :
    compressionDepth === 2 ? 'Perfect' :
    compressionDepth === 3 ? 'High' : 'None';

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full py-4">
      {/* Compression Bar */}
      <div className="flex flex-col items-center">
        <span className="mb-2 font-medium text-gray-700">Compressions</span>
        <svg width="90" height="260" viewBox="0 0 90 260">
          {/* Top oval */}
          <rect x="10" y="10" rx="20" ry="20" width="70" height="40" fill="#fff" stroke={green} strokeWidth="5" />
          {/* Bottom oval */}
          <rect x="10" y="210" rx="20" ry="20" width="70" height="40" fill={dark} stroke={green} strokeWidth="5" />
          {/* Bar fill */}
          <rect x="15" y={50 + (160 * (1 - fill))} width="60" height={160 * fill} fill={dark} />
          {/* Bar outline */}
          <rect x="15" y="50" width="60" height="160" fill="none" stroke={green} strokeWidth="5" rx="20" />
        </svg>
        <span className="mt-2 text-sm text-gray-600">Depth: {depthLabel}</span>
      </div>
      {/* Gauge */}
      <div className="flex flex-col items-center">
        <svg width="200" height="120" viewBox="0 0 200 120">
          {/* Gauge background */}
          <path d="M30,100 A70,70 0 0,1 170,100" fill="none" stroke={dark} strokeWidth="15" />
          {/* Gauge green section */}
          <path d="M60,100 A40,40 0 0,1 140,100" fill="none" stroke={green} strokeWidth="15" />
          {/* Needle */}
          <g transform={`rotate(${angle} 100 100)`}>
            <polygon points="95,100 100,40 105,100" fill={light} />
            <circle cx="100" cy="100" r="12" fill="#fff" stroke={light} strokeWidth="6" />
          </g>
        </svg>
        <span className="mt-2 text-sm text-gray-600">Rate: {compressionRate} /min</span>
      </div>
    </div>
  );
};

export default TrainingMonitor;
