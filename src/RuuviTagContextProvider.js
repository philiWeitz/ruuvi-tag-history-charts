import React from 'react';
import BleManager from 'react-native-ble-manager';
import {NativeEventEmitter, NativeModules} from 'react-native';

export const RuuviTagContext = React.createContext({});

const bleEmitter = new NativeEventEmitter(NativeModules.BleManager);

export const RuuviTagContextProvider = ({children}) => {
  const [sensorData, setSensorData] = React.useState({});
  const [temperatureValues, setTemperatureValues] = React.useState([]);

  React.useEffect(() => {
    BleManager.start({showAlert: true}).then(() => {
      startScanning();
      setInterval(startScanning, 20 * 1000);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setTemperatureValues([...temperatureValues, sensorData.temperature]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sensorData]);

  const isRuuviTag = (peripheral) => {
    const manufacturerData = peripheral.advertising
      ? peripheral.advertising.manufacturerData.bytes
      : undefined;

    return (
      manufacturerData &&
      manufacturerData[5] === 0x99 &&
      manufacturerData[6] === 0x04
    );
  };

  const parseData = (data) => {
    // eslint-disable-next-line no-bitwise
    const temperature = ((data[8] << 7) | data[9]) / 100;
    // eslint-disable-next-line no-bitwise
    const humidity = (((data[10] & 0xff) << 8) | (data[11] & 0xff)) / 400.0;
    // eslint-disable-next-line no-bitwise
    const pressure = (((data[12] & 0xff) << 8) | (data[13] & 0xff)) + 50000;

    return {temperature, humidity, pressure};
  };

  const startScanning = async () => {
    console.log('start scanning');
    await stopScanning();

    if (bleEmitter) {
      bleEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      );
    }
    await BleManager.scan([], 60, false);
  };

  const stopScanning = async () => {
    await BleManager.stopScan();

    if (bleEmitter) {
      bleEmitter.removeListener('BleManagerDiscoverPeripheral');
    }
  };

  const handleDiscoverPeripheral = (peripheral) => {
    if (isRuuviTag(peripheral)) {
      BleManager.stopScan().then(() => console.log('stop scanning'));

      bleEmitter.removeListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      );

      const peripheralData = parseData(
        peripheral.advertising.manufacturerData.bytes,
      );
      setSensorData(peripheralData);
      console.log('Data:', peripheralData);
    }
  };

  const contextValues = {sensorData, temperatureValues, startScanning};

  return (
    <RuuviTagContext.Provider value={contextValues}>
      {children}
    </RuuviTagContext.Provider>
  );
};
