import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { NavigationProvider } from './NavigationContext';
import { NAV } from './conf';

const ContextApp = () => {
  // i know, it's ugly. in a rush
  return (<NavigationProvider initialState={NAV.START}>
    <App />
  </NavigationProvider>)
}

ReactDOM.render(
  <ContextApp />,
  document.getElementById('root')
);
