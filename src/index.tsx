import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from 'styled-components';
import { theme } from './styled/theme';
import { StyledEngineProvider, useTheme } from '@mui/material/styles';
import { ApiContextProvider } from './ApiContext';

const Root: React.FC = () => {
  return (
      <React.StrictMode>
          <StyledEngineProvider injectFirst>
              <ThemeProvider theme={{ ...useTheme(), ...theme }}>
                <ApiContextProvider>
                  <App />
                </ApiContextProvider>
              </ThemeProvider>
          </StyledEngineProvider>
      </React.StrictMode>
  )
};

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
