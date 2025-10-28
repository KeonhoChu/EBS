import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  AutoAwesome,
  CloudUpload,
  Chat,
  Headphones,
  MenuBook,
  Timeline,
  Speed,
  Security,
} from '@mui/icons-material';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: <CloudUpload />,
      title: 'Upload Your Sources',
      description: 'Add PDFs, Docs, URLs, YouTube videos, and more',
      color: '#1a73e8',
    },
    {
      icon: <Chat />,
      title: 'Chat with AI',
      description: 'Ask questions and get answers with inline citations',
      color: '#34a853',
    },
    {
      icon: <MenuBook />,
      title: 'Generate Content',
      description: 'Create FAQs, study guides, briefing docs instantly',
      color: '#fbbc04',
    },
    {
      icon: <Headphones />,
      title: 'Audio Overviews',
      description: 'Listen to AI-generated podcast discussions',
      color: '#ea4335',
    },
  ];

  const capabilities = [
    {
      icon: <Speed />,
      text: 'Up to 50 sources per notebook',
    },
    {
      icon: <AutoAwesome />,
      text: 'Powered by Gemini 2.0 Flash',
    },
    {
      icon: <Security />,
      text: 'Your data stays private',
    },
    {
      icon: <Timeline />,
      text: 'Organize research efficiently',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              mx: 'auto',
              mb: 3,
            }}
          >
            <AutoAwesome sx={{ fontSize: 48 }} />
          </Avatar>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #1a73e8 30%, #34a853 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome to NotebookLM
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}
          >
            Your AI-powered research assistant that helps you understand complex
            information faster
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={onGetStarted}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s',
            }}
          >
            Get Started
          </Button>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: 1,
                  borderColor: 'divider',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: feature.color,
                    transform: 'translateY(-8px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: feature.color + '20',
                      color: feature.color,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Capabilities */}
        <Box
          sx={{
            textAlign: 'center',
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 4 }}>
            What you can do
          </Typography>

          <Grid container spacing={3}>
            {capabilities.map((capability, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'primary.50',
                      color: 'primary.main',
                    }}
                  >
                    {capability.icon}
                  </Avatar>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 500, textAlign: 'center' }}
                  >
                    {capability.text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="body2" color="text.secondary">
            Ready to transform the way you research?
          </Typography>
          <Button
            variant="text"
            onClick={onGetStarted}
            sx={{ mt: 1, fontWeight: 600 }}
          >
            Create your first notebook →
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default WelcomeScreen;
