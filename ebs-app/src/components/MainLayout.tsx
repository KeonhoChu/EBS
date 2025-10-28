import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import SourcesPanel from './SourcesPanel';
import ChatPanel from './ChatPanel';
import StudioPanel from './StudioPanel';

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [sourcesOpen, setSourcesOpen] = useState(true);
  const [studioOpen, setStudioOpen] = useState(true);

  const handleSourcesToggle = () => {
    setSourcesOpen(!sourcesOpen);
  };

  const handleStudioToggle = () => {
    setStudioOpen(!studioOpen);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Sources Panel - Left */}
      <SourcesPanel
        open={sourcesOpen}
        onToggle={handleSourcesToggle}
        isMobile={isMobile}
      />

      {/* Chat Panel - Center */}
      <ChatPanel
        sourcesOpen={sourcesOpen}
        studioOpen={studioOpen}
      />

      {/* Studio Panel - Right */}
      <StudioPanel
        open={studioOpen}
        onToggle={handleStudioToggle}
        isMobile={isMobile}
      />
    </Box>
  );
};

export default MainLayout;
