import { useEffect, useRef, useState } from 'react';

export function useCompressionMetrics(pressureValue: number, pressureStatus: 'low' | 'perfect' | 'high' | 'none') {
  const [compressionRate, setCompressionRate] = useState(0);
  const [compressionDepth, setCompressionDepth] = useState(0); // 1: Low, 2: Perfect, 3: High
  const [lastCompressionTime, setLastCompressionTime] = useState<number | null>(null);
  const compressionTimesRef = useRef<number[]>([]);

  useEffect(() => {
    if (pressureValue > 0 && pressureStatus !== 'none') {
      const now = Date.now();
      // Only count as a new compression if more than 300ms has passed
      if (!lastCompressionTime || now - lastCompressionTime > 300) {
        setLastCompressionTime(now);
        // Keep last 10 compression times for rate calculation
        compressionTimesRef.current = [...compressionTimesRef.current.slice(-9), now];
        if (compressionTimesRef.current.length > 1) {
          // Calculate average time between compressions for rate calculation
          const intervals = [];
          for (let i = 1; i < compressionTimesRef.current.length; i++) {
            intervals.push(compressionTimesRef.current[i] - compressionTimesRef.current[i - 1]);
          }
          const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
          const rate = Math.round(60000 / avgInterval); // Convert to compressions per minute
          setCompressionRate(rate);
        }
        // Calculate compression depth (assuming some threshold values for low, perfect, and high depth)
        if (pressureValue < 300) {
          setCompressionDepth(1); // Low depth
        } else if (pressureValue >= 300 && pressureValue <= 700) {
          setCompressionDepth(2); // Perfect depth
        } else {
          setCompressionDepth(3); // High depth
        }
      }
    }
  }, [pressureValue, pressureStatus, lastCompressionTime]);

  return { compressionRate, compressionDepth };
} 