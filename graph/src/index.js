import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { NavigationProvider } from './NavigationContext';
import { NAV } from './conf';


// CSS for YAI
import './YAIcss/style.css';
import './YAIcss/tree.css';
import './YAIcss/lib/bootstrap-4.5.2.min.css';
import './YAIcss/lib/bootstrap-vue-2.16.0.min.css';

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
