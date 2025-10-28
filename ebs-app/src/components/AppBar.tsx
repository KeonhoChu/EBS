import React, { useState } from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Settings,
  DarkMode,
  LightMode,
  AccountCircle,
  Add,
  FolderOpen,
  Language,
  HelpOutline,
  AutoAwesome,
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';

interface AppBarProps {
  onMenuClick?: () => void;
  notebookTitle?: string;
}

const AppBar: React.FC<AppBarProps> = ({
  onMenuClick,
  notebookTitle = 'My Research Notebook',
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isDarkMode, toggleTheme } = useThemeMode();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <MuiAppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          {/* Menu Icon */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo & Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <AutoAwesome color="primary" sx={{ fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              NotebookLM
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {notebookTitle}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="New Notebook">
              <IconButton color="inherit">
                <Add />
              </IconButton>
            </Tooltip>

            <Tooltip title="Open Notebook">
              <IconButton color="inherit">
                <FolderOpen />
              </IconButton>
            </Tooltip>

            <Tooltip title="Help">
              <IconButton color="inherit">
                <HelpOutline />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Settings Menu */}
            <Tooltip title="Settings">
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <Settings />
              </IconButton>
            </Tooltip>

            {/* User Avatar */}
            <Tooltip title="Account">
              <IconButton color="inherit">
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                  }}
                >
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </MuiAppBar>

      {/* Settings Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 280,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" color="text.secondary">
            SETTINGS
          </Typography>
        </Box>

        <Divider />

        <MenuItem>
          <ListItemIcon>
            {isDarkMode ? <DarkMode /> : <LightMode />}
          </ListItemIcon>
          <ListItemText>
            <FormControlLabel
              control={
                <Switch
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  size="small"
                />
              }
              label="Dark Mode"
              sx={{ m: 0 }}
            />
          </ListItemText>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <Language />
          </ListItemIcon>
          <ListItemText>Output Language</ListItemText>
          <Typography variant="caption" color="text.secondary">
            English
          </Typography>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <AutoAwesome />
          </ListItemIcon>
          <ListItemText>
            Upgrade to NotebookLM Plus
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <HelpOutline />
          </ListItemIcon>
          <ListItemText>Help & Feedback</ListItemText>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Powered by Gemini 2.0 Flash
          </Typography>
        </Box>
      </Menu>
    </>
  );
};

export default AppBar;
