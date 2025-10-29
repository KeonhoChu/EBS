import React, { useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Divider,
  Button,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Add,
  Description,
  Slideshow,
  PictureAsPdf,
  YouTube,
  Link as LinkIcon,
  AudioFile,
  Delete,
} from '@mui/icons-material';

interface Source {
  id: string;
  name: string;
  type: 'doc' | 'slides' | 'pdf' | 'youtube' | 'url' | 'audio';
  enabled: boolean;
  wordCount?: number;
}

interface SourcesPanelProps {
  open: boolean;
  onToggle: () => void;
  isMobile: boolean;
  onAddSource?: () => void;
  sources?: Source[];
  onSourcesChange?: (sources: Source[]) => void;
  onDeleteSource?: (id: string) => void;
}

const SourcesPanel: React.FC<SourcesPanelProps> = ({ open, onToggle, isMobile, onAddSource, sources: externalSources, onSourcesChange, onDeleteSource }) => {
  const [internalSources, setInternalSources] = useState<Source[]>([
    { id: '1', name: 'Research Document.pdf', type: 'pdf', enabled: true, wordCount: 12500 },
    { id: '2', name: 'Presentation Slides', type: 'slides', enabled: true, wordCount: 3200 },
    { id: '3', name: 'Tutorial Video', type: 'youtube', enabled: false, wordCount: 8900 },
  ]);

  // 외부에서 sources를 전달받으면 사용, 아니면 내부 state 사용
  const sources = externalSources || internalSources;
  const setSources = onSourcesChange || setInternalSources;

  const handleToggleSource = (id: string) => {
    const newSources = sources.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    setSources(newSources);
  };

  const getSourceIcon = (type: Source['type']) => {
    switch (type) {
      case 'doc': return <Description />;
      case 'slides': return <Slideshow />;
      case 'pdf': return <PictureAsPdf />;
      case 'youtube': return <YouTube />;
      case 'url': return <LinkIcon />;
      case 'audio': return <AudioFile />;
    }
  };

  const drawerWidth = open ? 280 : 60;

  const content = (
    <Box
      sx={{
        width: drawerWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: 1,
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
        {open && (
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Sources
          </Typography>
        )}
        <IconButton onClick={onToggle} size="small">
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      <Divider />

      {/* Add Source Button */}
      <Box sx={{ p: 2 }}>
        {open ? (
          <Button
            variant="contained"
            startIcon={<Add />}
            fullWidth
            onClick={onAddSource}
            sx={{
              textTransform: 'none',
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Add Source
          </Button>
        ) : (
          <Tooltip title="Add Source" placement="right">
            <IconButton
              color="primary"
              onClick={onAddSource}
              sx={{
                width: '100%',
                borderRadius: 1,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <Add />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Sources List */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 1 }}>
        <List>
          {sources.map((source) => (
            <Paper
              key={source.id}
              elevation={0}
              sx={{
                mb: 1,
                border: 1,
                borderColor: source.enabled ? 'primary.main' : 'divider',
                borderRadius: 1,
                bgcolor: source.enabled ? 'action.selected' : 'transparent',
              }}
            >
              <ListItem
                disablePadding
                secondaryAction={
                  open && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.1 }}>
                      <Tooltip title="Delete source">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSource?.(source.id);
                          }}
                          sx={{
                            '&:hover': {
                              color: 'error.main',
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Checkbox
                        edge="end"
                        checked={source.enabled}
                        onChange={() => handleToggleSource(source.id)}
                        size="small"
                      />
                    </Box>
                  )
                }
              >
                <ListItemButton onClick={() => handleToggleSource(source.id)}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getSourceIcon(source.type)}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={source.name}
                      secondary={`${source.wordCount?.toLocaleString()} words`}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        noWrap: true,
                      }}
                      secondaryTypographyProps={{
                        fontSize: '0.75rem',
                      }}
                      sx={{
                        pr: 9, // 삭제 버튼과 체크박스를 위한 충분한 여백
                        '& .MuiListItemText-primary': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Paper>
          ))}
        </List>
      </Box>

      {/* Footer Info */}
      {open && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            {sources.filter(s => s.enabled).length} of {sources.length} sources selected
          </Typography>
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
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

export default SourcesPanel;
