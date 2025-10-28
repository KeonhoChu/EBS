import React, { useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Divider,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  AutoAwesome,
  Quiz,
  MenuBook,
  Description,
  Timeline,
  FormatListBulleted,
  Headphones,
  Download,
  Share,
} from '@mui/icons-material';

interface StudioItem {
  id: string;
  type: 'faq' | 'study-guide' | 'briefing' | 'timeline' | 'toc' | 'audio';
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: 'generated' | 'generating' | 'not-generated';
}

interface StudioPanelProps {
  open: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const StudioPanel: React.FC<StudioPanelProps> = ({ open, onToggle, isMobile }) => {
  const [studioItems] = useState<StudioItem[]>([
    {
      id: '1',
      type: 'faq',
      title: 'FAQ',
      description: 'Common questions and answers from your sources',
      icon: <Quiz />,
      status: 'generated',
    },
    {
      id: '2',
      type: 'study-guide',
      title: 'Study Guide',
      description: 'Key concepts and highlights',
      icon: <MenuBook />,
      status: 'not-generated',
    },
    {
      id: '3',
      type: 'briefing',
      title: 'Briefing Doc',
      description: 'Concise summary of main points',
      icon: <Description />,
      status: 'not-generated',
    },
    {
      id: '4',
      type: 'timeline',
      title: 'Timeline',
      description: 'Chronological view of events',
      icon: <Timeline />,
      status: 'not-generated',
    },
    {
      id: '5',
      type: 'toc',
      title: 'Table of Contents',
      description: 'Structured outline of content',
      icon: <FormatListBulleted />,
      status: 'not-generated',
    },
    {
      id: '6',
      type: 'audio',
      title: 'Audio Overview',
      description: 'AI-generated podcast discussion',
      icon: <Headphones />,
      status: 'not-generated',
    },
  ]);

  const drawerWidth = open ? 320 : 60;

  const content = (
    <Box
      sx={{
        width: drawerWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderLeft: 1,
        borderColor: 'divider',
        transition: 'width 0.3s ease',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 64,
        }}
      >
        <IconButton onClick={onToggle} size="small">
          {open ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
        {open && (
          <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesome color="primary" />
            Studio
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Studio Items */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {open ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Notebook Guide Section */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
                NOTEBOOK GUIDE
              </Typography>
              <Card
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50',
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Get Started
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your sources have been analyzed. Generate content to explore insights.
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Generate Content Section */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
                GENERATE CONTENT
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {studioItems.map((item) => (
                  <Card
                    key={item.id}
                    elevation={0}
                    sx={{
                      border: 1,
                      borderColor: item.status === 'generated' ? 'success.main' : 'divider',
                      bgcolor: item.status === 'generated' ? 'success.50' : 'background.paper',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: 1,
                      },
                    }}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {item.icon}
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {item.title}
                        </Typography>
                        {item.status === 'generated' && (
                          <Chip label="Ready" size="small" color="success" sx={{ ml: 'auto' }} />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {item.description}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      {item.status === 'generated' ? (
                        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                          <Button size="small" variant="outlined" fullWidth>
                            View
                          </Button>
                          <IconButton size="small">
                            <Download fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <Share fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          fullWidth
                          startIcon={<AutoAwesome />}
                          sx={{ textTransform: 'none' }}
                        >
                          Generate
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {studioItems.map((item) => (
              <Tooltip key={item.id} title={item.title} placement="left">
                <IconButton
                  sx={{
                    borderRadius: 1,
                    color: item.status === 'generated' ? 'success.main' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onToggle}
        variant="temporary"
      >
        {content}
      </Drawer>
    );
  }

  return content;
};

export default StudioPanel;
