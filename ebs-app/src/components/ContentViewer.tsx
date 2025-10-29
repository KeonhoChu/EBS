import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Paper,
} from '@mui/material';
import {
  Close,
  Download,
  Share,
  ContentCopy,
  ExpandMore,
  CheckCircle,
} from '@mui/icons-material';

interface ContentItem {
  question?: string;
  answer?: string;
  title?: string;
  content?: string;
  date?: string;
  description?: string;
}

interface ContentViewerProps {
  open: boolean;
  onClose: () => void;
  contentType: 'faq' | 'study-guide' | 'briefing' | 'timeline' | 'toc';
  title: string;
  data: ContentItem[];
  onDownload?: () => void;
  onShare?: () => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({
  open,
  onClose,
  contentType,
  title,
  data,
  onDownload,
  onShare,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Simulate copying content
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFAQ = () => (
    <Box>
      {data.map((item, idx) => (
        <Accordion
          key={idx}
          elevation={0}
          sx={{
            mb: 1,
            border: 1,
            borderColor: 'divider',
            '&:before': { display: 'none' },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {item.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              {item.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  const renderStudyGuide = () => (
    <Box>
      {data.map((item, idx) => (
        <Paper
          key={idx}
          elevation={0}
          sx={{
            p: 3,
            mb: 2,
            border: 1,
            borderColor: 'divider',
            borderLeft: 4,
            borderLeftColor: 'primary.main',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {item.content}
          </Typography>
          {item.description && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'primary.50',
                borderRadius: 1,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Key Takeaway:
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {item.description}
              </Typography>
            </Box>
          )}
        </Paper>
      ))}
    </Box>
  );

  const renderBriefing = () => (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: 1,
          borderColor: 'primary.main',
          bgcolor: 'primary.50',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Executive Summary
        </Typography>
        <Typography variant="body2">
          This briefing document provides a comprehensive overview of the key findings
          and insights from your sources.
        </Typography>
      </Paper>

      {data.map((item, idx) => (
        <Box key={idx} sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {idx + 1}. {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {item.content}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  const renderTimeline = () => (
    <Box sx={{ position: 'relative', pl: 4 }}>
      {/* Vertical line */}
      <Box
        sx={{
          position: 'absolute',
          left: 15,
          top: 0,
          bottom: 0,
          width: 2,
          bgcolor: 'primary.main',
        }}
      />

      {data.map((item, idx) => (
        <Box key={idx} sx={{ mb: 4, position: 'relative' }}>
          {/* Dot */}
          <Box
            sx={{
              position: 'absolute',
              left: -28,
              top: 4,
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              border: 3,
              borderColor: 'background.paper',
            }}
          />

          {/* Date chip */}
          <Chip
            label={item.date}
            size="small"
            color="primary"
            sx={{ mb: 1, fontWeight: 600 }}
          />

          {/* Content */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.content}
            </Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );

  const renderTOC = () => (
    <List>
      {data.map((item, idx) => (
        <ListItem
          key={idx}
          sx={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            mb: 1,
            '&:hover': {
              bgcolor: 'action.hover',
              cursor: 'pointer',
            },
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {idx + 1}. {item.title}
          </Typography>
          {item.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {item.description}
            </Typography>
          )}
        </ListItem>
      ))}
    </List>
  );

  const renderContent = () => {
    switch (contentType) {
      case 'faq':
        return renderFAQ();
      case 'study-guide':
        return renderStudyGuide();
      case 'briefing':
        return renderBriefing();
      case 'timeline':
        return renderTimeline();
      case 'toc':
        return renderTOC();
      default:
        return null;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 600 },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={handleCopy}>
            {copied ? <CheckCircle color="success" /> : <ContentCopy />}
          </IconButton>
          <IconButton size="small" onClick={onDownload}>
            <Download />
          </IconButton>
          <IconButton size="small" onClick={onShare}>
            <Share />
          </IconButton>
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
        {renderContent()}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          startIcon={<Download />}
          onClick={onDownload}
        >
          Export as PDF
        </Button>
      </Box>
    </Drawer>
  );
};

// Sample data for demonstration
export const sampleFAQData: ContentItem[] = [
  {
    question: 'What is the main focus of this research?',
    answer: 'The main focus is on applying machine learning techniques to improve natural language understanding in conversational AI systems.',
  },
  {
    question: 'What are the key findings?',
    answer: 'Key findings include improved accuracy in intent classification and significant reduction in response latency.',
  },
  {
    question: 'What methodology was used?',
    answer: 'The study employed a mixed-methods approach combining quantitative analysis and qualitative user feedback.',
  },
];

export const sampleStudyGuideData: ContentItem[] = [
  {
    title: 'Core Concepts',
    content: 'Machine learning models require large amounts of training data to achieve optimal performance. Transfer learning can significantly reduce this requirement.',
    description: 'Pre-trained models can be fine-tuned for specific tasks with less data.',
  },
  {
    title: 'Key Algorithms',
    content: 'Transformer architectures have revolutionized NLP by enabling parallel processing of sequences and capturing long-range dependencies.',
    description: 'Attention mechanisms are the foundation of modern language models.',
  },
];

export const sampleTimelineData: ContentItem[] = [
  {
    date: 'Jan 2025',
    title: 'Project Initiation',
    content: 'Research project officially launched with initial team formation and goal setting.',
  },
  {
    date: 'Mar 2025',
    title: 'Data Collection Phase',
    content: 'Completed comprehensive data gathering from multiple sources.',
  },
  {
    date: 'Oct 2025',
    title: 'Current Status',
    content: 'Analysis phase in progress with preliminary findings documented.',
  },
];

export default ContentViewer;
