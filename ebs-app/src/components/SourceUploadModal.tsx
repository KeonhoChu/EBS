import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tab,
  Tabs,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Close,
  CloudUpload,
  Description,
  Link as LinkIcon,
  YouTube,
  Google,
  Delete,
  CheckCircle,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface SourceUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (sources: any[]) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
}

const SourceUploadModal: React.FC<SourceUploadModalProps> = ({
  open,
  onClose,
  onUpload,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file) => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                progress,
                status: progress >= 100 ? 'completed' : 'uploading',
              }
            : f
        )
      );
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 300);
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;

    const newFile: UploadedFile = {
      id: Math.random().toString(36).substring(7),
      name: urlInput,
      size: 0,
      type: 'url',
      status: 'completed',
      progress: 100,
    };

    setFiles((prev) => [...prev, newFile]);
    setUrlInput('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'URL';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleUpload = () => {
    onUpload(files);
    onClose();
    setFiles([]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Add Sources
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
          <Tab label="Upload Files" icon={<CloudUpload />} iconPosition="start" />
          <Tab label="Add URL" icon={<LinkIcon />} iconPosition="start" />
          <Tab label="Google Drive" icon={<Google />} iconPosition="start" />
        </Tabs>

        {/* Upload Files Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{
              border: 2,
              borderStyle: 'dashed',
              borderColor: dragActive ? 'primary.main' : 'divider',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              bgcolor: dragActive ? 'action.hover' : 'transparent',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
          >
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileInput}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.txt,.md,.mp3,.mp4,.wav"
            />
            <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
              <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Drag and drop files here
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                or click to browse
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supports PDF, Docs, Text, Markdown, Audio (MP3, WAV), Video (MP4)
                <br />
                Max 200MB per file, 500,000 words
              </Typography>
            </label>
          </Box>

          {files.length > 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Free version: {files.length}/50 sources used
            </Alert>
          )}
        </TabPanel>

        {/* Add URL Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box>
            <TextField
              fullWidth
              placeholder="Paste URL here (YouTube, web pages, etc.)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddUrl();
                }
              }}
              InputProps={{
                startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleAddUrl}
              disabled={!urlInput.trim()}
              fullWidth
            >
              Add URL
            </Button>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Supported URLs:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[
                  { icon: <YouTube />, label: 'YouTube' },
                  { icon: <LinkIcon />, label: 'Web Pages' },
                  { icon: <Description />, label: 'Public Docs' },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 1.5,
                      py: 0.5,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    {item.icon}
                    <Typography variant="caption">{item.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </TabPanel>

        {/* Google Drive Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Google sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Connect to Google Drive
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Import Google Docs, Slides, and other files
            </Typography>
            <Button variant="contained" startIcon={<Google />}>
              Connect Google Drive
            </Button>
          </Box>
        </TabPanel>

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Files ({files.length})
            </Typography>
            <List>
              {files.map((file) => (
                <ListItem
                  key={file.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    {file.status === 'completed' ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Description />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={
                      <>
                        {formatFileSize(file.size)}
                        {file.status === 'uploading' && (
                          <LinearProgress
                            variant="determinate"
                            value={file.progress}
                            sx={{ mt: 1 }}
                          />
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveFile(file.id)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={files.length === 0 || files.some((f) => f.status === 'uploading')}
        >
          Add {files.length} {files.length === 1 ? 'Source' : 'Sources'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SourceUploadModal;
