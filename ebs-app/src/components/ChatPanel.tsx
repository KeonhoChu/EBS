import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Chip,
  Link,
  Avatar,
} from '@mui/material';
import {
  Send,
  AutoAwesome,
  ContentCopy,
  ThumbUp,
  ThumbDown,
} from '@mui/icons-material';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{ source: string; page?: number }>;
  timestamp: Date;
}

interface ChatPanelProps {
  sourcesOpen: boolean;
  studioOpen: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ sourcesOpen, studioOpen }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m here to help you explore your sources. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const suggestedQuestions = [
    'What are the main themes in these documents?',
    'Summarize the key findings',
    'What are the important dates mentioned?',
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a simulated response based on your sources. The information comes from your uploaded documents.',
        citations: [
          { source: 'Research Document.pdf', page: 12 },
          { source: 'Presentation Slides', page: 5 },
        ],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        minWidth: 0,
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesome color="primary" />
          Chat with your sources
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Ask questions and get answers with citations
        </Typography>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'flex-start',
            }}
          >
            {/* Avatar */}
            <Avatar
              sx={{
                bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                width: 36,
                height: 36,
              }}
            >
              {message.role === 'user' ? 'U' : 'AI'}
            </Avatar>

            {/* Message Content */}
            <Box sx={{ flex: 1, maxWidth: '100%' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: message.role === 'user' ? 'primary.50' : 'background.paper',
                  border: 1,
                  borderColor: message.role === 'user' ? 'primary.200' : 'divider',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Typography>

                {/* Citations */}
                {message.citations && message.citations.length > 0 && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {message.citations.map((citation, idx) => (
                      <Chip
                        key={idx}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              {idx + 1}
                            </Typography>
                            <Typography variant="caption">
                              {citation.source}
                              {citation.page && ` · p.${citation.page}`}
                            </Typography>
                          </Box>
                        }
                        size="small"
                        component={Link}
                        href="#"
                        clickable
                        sx={{
                          bgcolor: 'primary.50',
                          borderColor: 'primary.main',
                          '&:hover': {
                            bgcolor: 'primary.100',
                          },
                        }}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </Paper>

              {/* Message Actions */}
              {message.role === 'assistant' && (
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <IconButton size="small">
                    <ContentCopy fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <ThumbUp fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <ThumbDown fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        ))}

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Try asking:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {suggestedQuestions.map((question, idx) => (
                <Chip
                  key={idx}
                  label={question}
                  onClick={() => setInput(question)}
                  sx={{
                    justifyContent: 'flex-start',
                    height: 'auto',
                    py: 1.5,
                    px: 2,
                    '& .MuiChip-label': {
                      whiteSpace: 'normal',
                      textAlign: 'left',
                    },
                  }}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Ask a question about your sources..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!input.trim()}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground',
              },
            }}
          >
            <Send />
          </IconButton>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Press Enter to send, Shift+Enter for new line
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatPanel;
