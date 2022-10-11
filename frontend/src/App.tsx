import React from 'react';
import {HashRouter, Route, Routes} from 'react-router-dom';
import Home from './pages/home';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
      <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <HashRouter>
              <Routes>
                  <Route path="/" element={<Home />}></Route>
              </Routes>
          </HashRouter>
      </ThemeProvider>
  );
}

export default App;
