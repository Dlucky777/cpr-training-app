import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  memoryUsage: number;
  isOffline: boolean;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    memoryUsage: 0,
    isOffline: !navigator.onLine
  });

  useEffect(() => {
    // Measure initial load time
    const loadTime = performance.now();
    setMetrics(prev => ({ ...prev, loadTime }));

    // Monitor online/offline status
    const handleOnline = () => setMetrics(prev => ({ ...prev, isOffline: false }));
    const handleOffline = () => setMetrics(prev => ({ ...prev, isOffline: true }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Monitor memory usage if available
    if ('memory' in performance) {
      const updateMemory = () => {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: (performance as any).memory.usedJSHeapSize / 1048576 // Convert to MB
        }));
      };
      updateMemory();
      const interval = setInterval(updateMemory, 5000);
      return () => {
        clearInterval(interval);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 text-sm">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="h-4 w-4 text-gray-600" />
        <span className="font-medium">Performance</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-600">Load Time:</span>
          <span className="font-mono">{metrics.loadTime.toFixed(0)}ms</span>
        </div>
        {metrics.memoryUsage > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Memory:</span>
            <span className="font-mono">{metrics.memoryUsage.toFixed(1)}MB</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={metrics.isOffline ? 'text-red-500' : 'text-green-500'}>
            {metrics.isOffline ? 'Offline' : 'Online'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor; 