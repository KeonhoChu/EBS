import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Slider,
  Avatar,
  Button,
  Chip,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Speed,
  Download,
  Share,
  Mic,
  GraphicEq,
  Close,
} from '@mui/icons-material';

interface AudioOverviewPlayerProps {
  title?: string;
  duration?: number;
  isGenerating?: boolean;
  onDownload?: () => void;
  onShare?: () => void;
  onClose?: () => void;
}

const AudioOverviewPlayer: React.FC<AudioOverviewPlayerProps> = ({
  title = 'Audio Overview',
  duration = 1245, // seconds
  isGenerating = false,
  onDownload,
  onShare,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isInteractive, setIsInteractive] = useState(false);

  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Simulate playback
    if (!isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
  };

  const handleSpeedChange = () => {
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  if (isGenerating) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <GraphicEq sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Generating Audio Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Creating a deep dive discussion of your sources...
            </Typography>
          </Box>
        </Box>
        <LinearProgress />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          This usually takes 2-3 minutes
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: 1,
        borderColor: 'primary.main',
        borderRadius: 2,
        bgcolor: 'primary.50',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: 'primary.main',
          }}
        >
          <GraphicEq sx={{ fontSize: 32 }} />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI-generated podcast • {formatTime(duration)}
          </Typography>
        </Box>
        <Chip
          label="NEW"
          color="primary"
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* Waveform Visualization (Simulated) */}
      <Box
        sx={{
          height: 60,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          bgcolor: 'background.paper',
          borderRadius: 1,
          px: 1,
        }}
      >
        {Array.from({ length: 60 }).map((_, idx) => (
          <Box
            key={idx}
            sx={{
              flex: 1,
              height: `${Math.random() * 80 + 20}%`,
              bgcolor: idx / 60 <= currentTime / duration ? 'primary.main' : 'divider',
              borderRadius: 0.5,
              transition: 'all 0.1s',
            }}
          />
        ))}
      </Box>

      {/* Progress Slider */}
      <Box sx={{ mb: 2 }}>
        <Slider
          value={currentTime}
          min={0}
          max={duration}
          onChange={(_, value) => setCurrentTime(value as number)}
          sx={{
            '& .MuiSlider-thumb': {
              width: 16,
              height: 16,
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            {formatTime(currentTime)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatTime(duration)}
          </Typography>
        </Box>
      </Box>

      {/* Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        {/* Main Play Button */}
        <IconButton
          onClick={handlePlayPause}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            width: 48,
            height: 48,
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>

        {/* Speed Control */}
        <Tooltip title="Playback speed">
          <Button
            size="small"
            startIcon={<Speed />}
            onClick={handleSpeedChange}
            sx={{
              minWidth: 80,
              bgcolor: 'background.paper',
            }}
          >
            {playbackSpeed}x
          </Button>
        </Tooltip>

        {/* Volume Control */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <IconButton size="small" onClick={() => setIsMuted(!isMuted)}>
            {isMuted || volume === 0 ? <VolumeOff /> : <VolumeUp />}
          </IconButton>
          <Slider
            value={isMuted ? 0 : volume}
            onChange={(_, value) => {
              setVolume(value as number);
              setIsMuted(false);
            }}
            sx={{ maxWidth: 100 }}
          />
        </Box>

        {/* Actions */}
        <IconButton size="small" onClick={onDownload}>
          <Download />
        </IconButton>
        <IconButton size="small" onClick={onShare}>
          <Share />
        </IconButton>
        {onClose && (
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Interactive Mode */}
      <Box
        sx={{
          p: 2,
          bgcolor: isInteractive ? 'success.50' : 'background.paper',
          borderRadius: 1,
          border: 1,
          borderColor: isInteractive ? 'success.main' : 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Mic color={isInteractive ? 'success' : 'action'} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Interactive Mode
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Join the conversation and ask questions
              </Typography>
            </Box>
          </Box>
          <Button
            variant={isInteractive ? 'contained' : 'outlined'}
            color={isInteractive ? 'success' : 'primary'}
            size="small"
            onClick={() => setIsInteractive(!isInteractive)}
          >
            {isInteractive ? 'Listening...' : 'Join'}
          </Button>
        </Box>
      </Box>

      {/* Currently Speaking */}
      {isPlaying && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            NOW SPEAKING
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              H1
            </Avatar>
            <Typography variant="body2">
              "This research demonstrates the potential of transformer architectures..."
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default AudioOverviewPlayer;
