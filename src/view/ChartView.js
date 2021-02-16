import React from 'react';
import {LineChart} from 'react-native-chart-kit';
import {View, Text, Dimensions, Button} from 'react-native';
import {RuuviTagContext} from '../RuuviTagContextProvider';

const screenWidth = Dimensions.get('window').width;

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      strokeWidth: 2,
    },
  ],
  legend: ['Rainy Days'],
};

export const ChartView = () => {
  const {sensorData, temperatureValues, startScanning} = React.useContext(
    RuuviTagContext,
  );
  const {temperature, humidity, pressure} = sensorData;

  return (
    <View>
      <Button title="Scan" onPress={startScanning} />
      <Text>Temperature: {temperature}</Text>
      <Text>Humidity: {humidity}</Text>
      <Text>Pressure: {pressure}</Text>

      <Text>All: {temperatureValues.join(', ')}</Text>

      <LineChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
      />
    </View>
  );
};
