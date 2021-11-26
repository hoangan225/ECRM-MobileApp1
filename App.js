import React from 'react';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
    'Animated: `useNativeDriver` was not specified.',
]);
import App from './app/main';
export default App;