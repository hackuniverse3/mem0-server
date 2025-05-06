import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import Dashboard from './pages/Dashboard';
import MemoryList from './pages/MemoryList';
import MemoryDetail from './pages/MemoryDetail';
import AddMemory from './pages/AddMemory';

// Components
import Layout from './components/Layout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/memories" element={<MemoryList />} />
          <Route path="/memories/:id" element={<MemoryDetail />} />
          <Route path="/add-memory" element={<AddMemory />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App; 