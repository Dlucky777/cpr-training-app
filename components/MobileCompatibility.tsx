import React, { useEffect, useState } from 'react';
import { Smartphone, AlertTriangle } from 'lucide-react';

const MobileCompatibility: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [browserInfo, setBrowserInfo] = useState({
    name: '',
    version: '',
    isSupported: true,
    isIOS: false
  });

  useEffect(() => {
    // Check if mobile
    const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);

    // Get browser info
    const userAgent = navigator.userAgent;
    let browserName = '';
    let browserVersion = '';
    let isSupported = true;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);

    if (userAgent.indexOf('CriOS') > -1) {
      // Chrome on iOS
      browserName = 'Chrome';
      browserVersion = userAgent.match(/CriOS\/(\d+\.\d+\.\d+\.\d+)/)?.[1] || '';
      isSupported = false; // Chrome on iOS doesn't support Web Bluetooth
    } else if (userAgent.indexOf('Chrome') > -1) {
      browserName = 'Chrome';
      browserVersion = userAgent.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/)?.[1] || '';
    } else if (userAgent.indexOf('Safari') > -1) {
      browserName = 'Safari';
      browserVersion = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || '';
      isSupported = false;
    } else if (userAgent.indexOf('Firefox') > -1) {
      browserName = 'Firefox';
      browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || '';
    }

    setBrowserInfo({ name: browserName, version: browserVersion, isSupported, isIOS });
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-yellow-50 border-b border-yellow-200 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Smartphone className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Mobile Device Detected
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Browser: {browserInfo.name} {browserInfo.version}</p>
              {!browserInfo.isSupported && (
                <div className="mt-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-400 mr-1" />
                  <p>
                    {browserInfo.isIOS 
                      ? "iOS devices don't support Bluetooth in web browsers. Please use a native app for full functionality."
                      : "This browser doesn't support Bluetooth. Please use Chrome on Android."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCompatibility; 