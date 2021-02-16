import React from 'react';
import {ChartView} from './view/ChartView';
import {RuuviTagContextProvider} from './RuuviTagContextProvider';

const App = () => {
  return (
    <RuuviTagContextProvider>
      <ChartView />
    </RuuviTagContextProvider>
  );
};

export default App;
