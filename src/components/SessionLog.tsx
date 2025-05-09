import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { CPRSession } from '../types';

interface SessionLogProps {
  sessions: CPRSession[];
}

const SessionLog: React.FC<SessionLogProps> = ({ sessions }) => {
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  
  if (sessions.length === 0) {
    return null;
  }
  
  const toggleExpand = (sessionId: string) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
    } else {
      setExpandedSession(sessionId);
    }
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  const formatDuration = (startTime: number, endTime: number | null) => {
    if (!endTime) return 'Ongoing';
    
    const durationMs = endTime - startTime;
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Session History</h2>
      
      <div className="divide-y divide-gray-200">
        {sessions.slice().reverse().map((session) => (
          <div key={session.id} className="py-4">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(session.id)}
            >
              <div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="font-medium">{formatDate(session.startTime)}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Duration: {formatDuration(session.startTime, session.endTime)}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-3 text-right">
                  <div className="font-medium">{session.perfectPressurePercentage.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">perfect pressure</div>
                </div>
                {expandedSession === session.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
            
            {expandedSession === session.id && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Average Pressure</div>
                    <div className="font-medium">{session.averagePressure.toFixed(1)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Perfect Pressure</div>
                    <div className="font-medium">{session.perfectPressurePercentage.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Start Time</div>
                    <div className="font-medium">{formatDate(session.startTime)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">End Time</div>
                    <div className="font-medium">
                      {session.endTime ? formatDate(session.endTime) : 'Ongoing'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="text-sm text-gray-500 mb-2">Pressure Distribution</div>
                  <div className="flex h-6 w-full rounded-md overflow-hidden">
                    {session.readings.length > 0 && (
                      <>
                        <div 
                          className="bg-yellow-500 h-full" 
                          style={{ 
                            width: `${(session.readings.filter(r => r.status === 'low').length / session.readings.length) * 100}%` 
                          }}
                        ></div>
                        <div 
                          className="bg-green-500 h-full" 
                          style={{ 
                            width: `${(session.readings.filter(r => r.status === 'perfect').length / session.readings.length) * 100}%` 
                          }}
                        ></div>
                        <div 
                          className="bg-red-500 h-full" 
                          style={{ 
                            width: `${(session.readings.filter(r => r.status === 'high').length / session.readings.length) * 100}%` 
                          }}
                        ></div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Too Light</span>
                    <span>Perfect</span>
                    <span>Too Hard</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionLog;