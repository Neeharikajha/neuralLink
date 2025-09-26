import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';

export default function GitHubCallback() {
  const [searchParams] = useSearchParams();
  const { handleGitHubCallback } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const success = searchParams.get('success');
      const error = searchParams.get('error');
      const message = searchParams.get('message');

      if (error) {
        const errorMessage = message ? decodeURIComponent(message) : 'GitHub authentication was cancelled or failed';
        setError(errorMessage);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (success === 'true' && token) {
        try {
          const result = await handleGitHubCallback(token);
          if (result.success) {
            navigate('/dashboard');
          } else {
            setError(result.error);
            setTimeout(() => navigate('/login'), 3000);
          }
        } catch (err) {
          console.error('Error handling GitHub callback:', err);
          setError('Failed to complete authentication');
          setTimeout(() => navigate('/login'), 3000);
        }
      } else {
        setError('Invalid authentication response');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, handleGitHubCallback, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0b1020',
        color: 'white'
      }}
    >
      {error ? (
        <>
          <Alert severity="error" sx={{ mb: 2, maxWidth: 400 }}>
            {error}
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Redirecting to login page...
          </Typography>
        </>
      ) : (
        <>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Authenticating with GitHub...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we complete your authentication.
          </Typography>
        </>
      )}
    </Box>
  );
}
