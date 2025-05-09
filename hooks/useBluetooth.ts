import { useState, useCallback, useRef } from 'react';

const CPR_SERVICE_UUID = '0000180d-0000-1000-8000-00805f9b34fb';
const PRESSURE_CHARACTERISTIC_UUID = '00002a37-0000-1000-8000-00805f9b34fb';

export const useBluetooth = () => {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pressureValue, setPressureValue] = useState<number>(0);
  const [pressureStatus, setPressureStatus] = useState<'low' | 'perfect' | 'high' | 'none'>('none');

  // Use useRef to persist characteristic without causing re-renders
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);

  const connectToDevice = useCallback(async () => {
    if (!navigator.bluetooth) {
      setError('Bluetooth is not supported in this browser');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [CPR_SERVICE_UUID] }],
        optionalServices: [CPR_SERVICE_UUID],
      });

      const server = await device.gatt?.connect();
      if (!server) throw new Error('Failed to connect to GATT server');

      const service = await server.getPrimaryService(CPR_SERVICE_UUID);
      const characteristic = await service.getCharacteristic(PRESSURE_CHARACTERISTIC_UUID);

      // Store characteristic in useRef for later use
      characteristicRef.current = characteristic;

      await characteristic.startNotifications();

      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
        const dataView = new DataView(value?.buffer);

  // Read the first 2 bytes as a little-endian 16-bit integer
  const sensorValue = dataView.getUint16(0, /* littleEndian = */ true);

  console.log('Received Sensor Value:', sensorValue);
        if (sensorValue) {
          
          console.log(sensorValue)
          setPressureValue(sensorValue);

          if (sensorValue < 49) setPressureStatus('low');
          else if (sensorValue > 50 && sensorValue < 200) setPressureStatus('high');
          else setPressureStatus('perfect');
        }
        else{
          setPressureValue(0)
        }
      });

      device.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        characteristicRef.current = null;
      });

      setDevice(device);
      setIsConnected(true);

      console.log('Connected and characteristic set:', characteristic);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.includes('cancelled')) {
        console.log('User cancelled device selection');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectDevice = useCallback(() => {
    if (device?.gatt?.connected) {
      device.gatt.disconnect();
      setIsConnected(false);
      characteristicRef.current = null;
      setPressureStatus('none');
      setPressureValue(0);
    }
  }, [device]);

  // Function to send data using the characteristic
  const sendData = useCallback(async (data: number) => {
    if (characteristicRef.current) {
      const value = new Uint8Array([data]);
      await characteristicRef.current.writeValue(value);
      console.log('Data sent:', data);
    } else {
      console.warn('Characteristic not available');
    }
  }, []);

  return {
    connectToDevice,
    disconnectDevice,
    sendData, // Use this to send data to your hardware
    isConnected,
    isConnecting,
    error,
    pressureValue,
    pressureStatus,
    isBluetoothAvailable: !!navigator.bluetooth,
  };
};