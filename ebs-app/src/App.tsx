import React from 'react';
import { Box } from '@mui/material';
import AppBar from './components/AppBar';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AppBar notebookTitle="My Research Notebook" />
      <MainLayout />
    </Box>
  );
}

export default App;