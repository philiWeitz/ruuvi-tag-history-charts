import {AsyncStorage} from 'react-native';

export const RuuviTagStorage = {
  setTemperatureValues: (temperatureValues) => {
    try {
      return AsyncStorage.setItem('temperatures', temperatureValues);
    } catch (error) {
      console.log(error);
    }
    return Promise.resolve();
  },

  getTemperatureValues: () => {
    try {
      return AsyncStorage.getItem('temperatures');
    } catch (error) {
      console.error('Error getting temperature values from storage', error);
    }
    return Promise.resolve([]);
  },
};
