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
  CircularProgress,
} from '@mui/material';
import {
  Send,
  AutoAwesome,
  ContentCopy,
  ThumbUp,
  ThumbDown,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { answerQuestion } from '../services/llmClient';

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
  onShowSnackbar?: (message: string, severity?: 'success' | 'info' | 'warning' | 'error') => void;
  sources?: Array<{ name: string; type: string; enabled: boolean }>;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ sourcesOpen, studioOpen, onShowSnackbar, sources: externalSources }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! 소스 문서를 분석하고 질문에 답변해드리는 AI 어시스턴트입니다. 무엇을 도와드릴까요?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 외부에서 전달받은 sources 사용 (없으면 기본값)
  const defaultSources = [
    { name: 'Research Document.pdf', type: 'pdf', enabled: true },
    { name: 'Presentation Slides', type: 'slides', enabled: true },
    { name: 'Tutorial Video', type: 'youtube', enabled: true },
  ];
  const sources = externalSources || defaultSources;

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    onShowSnackbar?.('메시지가 복사되었습니다', 'success');
  };

  const handleThumbUp = () => {
    onShowSnackbar?.('피드백 감사합니다!', 'success');
  };

  const handleThumbDown = () => {
    onShowSnackbar?.('피드백 감사합니다. 개선하겠습니다.', 'info');
  };

  const suggestedQuestions = [
    '이 문서들의 주요 주제는 무엇인가요?',
    '핵심 발견사항을 요약해주세요',
    '중요한 날짜나 일정은 무엇인가요?',
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // enabled된 소스만 필터링
    const enabledSources = sources.filter(s => s.enabled).map(s => ({ name: s.name, type: s.type }));

    if (enabledSources.length === 0) {
      onShowSnackbar?.('먼저 소스를 활성화해주세요', 'warning');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 실제 LLM 호출 (enabled된 소스만 사용)
      const { answer, citations } = await answerQuestion(input, enabledSources);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        citations: citations,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error: any) {
      console.error('LLM 오류:', error);

      // 오류 메시지 표시
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `죄송합니다. 응답을 생성하는 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      onShowSnackbar?.('AI 응답 생성 중 오류가 발생했습니다', 'error');
    } finally {
      setIsLoading(false);
    }
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
                <Box
                  sx={{
                    '& p': {
                      margin: '0.5em 0',
                      lineHeight: 1.6,
                    },
                    '& p:first-of-type': {
                      marginTop: 0,
                    },
                    '& p:last-child': {
                      marginBottom: 0,
                    },
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                      marginTop: '1em',
                      marginBottom: '0.5em',
                      fontWeight: 600,
                    },
                    '& ul, & ol': {
                      marginLeft: '1.5em',
                      marginTop: '0.5em',
                      marginBottom: '0.5em',
                    },
                    '& li': {
                      marginBottom: '0.25em',
                    },
                    '& code': {
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      padding: '0.2em 0.4em',
                      borderRadius: '3px',
                      fontFamily: 'monospace',
                      fontSize: '0.9em',
                    },
                    '& pre': {
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      padding: '1em',
                      borderRadius: '6px',
                      overflow: 'auto',
                      marginTop: '0.5em',
                      marginBottom: '0.5em',
                    },
                    '& pre code': {
                      backgroundColor: 'transparent',
                      padding: 0,
                    },
                    '& blockquote': {
                      borderLeft: '4px solid',
                      borderColor: 'primary.main',
                      paddingLeft: '1em',
                      marginLeft: 0,
                      marginTop: '0.5em',
                      marginBottom: '0.5em',
                      color: 'text.secondary',
                    },
                    '& table': {
                      borderCollapse: 'collapse',
                      width: '100%',
                      marginTop: '0.5em',
                      marginBottom: '0.5em',
                    },
                    '& th, & td': {
                      border: '1px solid',
                      borderColor: 'divider',
                      padding: '0.5em',
                      textAlign: 'left',
                    },
                    '& th': {
                      backgroundColor: 'action.hover',
                      fontWeight: 600,
                    },
                    '& a': {
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    },
                    '& hr': {
                      border: 'none',
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      marginTop: '1em',
                      marginBottom: '1em',
                    },
                  }}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </Box>

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
                  <IconButton
                    size="small"
                    onClick={() => handleCopyMessage(message.content)}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleThumbUp}
                  >
                    <ThumbUp fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleThumbDown}
                  >
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
            disabled={!input.trim() || isLoading}
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
            {isLoading ? <CircularProgress size={24} color="inherit" /> : <Send />}
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
