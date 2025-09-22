import React from "react";
import { Button, Box, Typography, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#111",
      paper: "#111"
    },
    text: {
      primary: "#fff"
    }
  },
  typography: {
    fontFamily: "'Montserrat', Arial, sans-serif",
    fontWeightBold: 700
  }
});

const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize?client_id=Ov23likgskNOxnEZVgl7&redirect_uri=http://localhost:3000/auth/callback";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=profile email openid";

export default function LandingPage() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Container maxWidth="xs" sx={{ textAlign: "center" }}>
          <Typography
            variant="h2"
            component="h1"
            color="white"
            fontWeight="bold"
            gutterBottom
            sx={{ letterSpacing: "1px" }}
          >
            NeuralLink
          </Typography>
          <Typography
            variant="h6"
            color="white"
            fontWeight="bold"
            gutterBottom
            sx={{ opacity: 0.8, mb: 3 }}
          >
            Discover and contribute to projects based on your unique skills.<br />
            Get personalized open-source matches instantly.
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
            <Button
              size="large"
              startIcon={<GoogleIcon />}
              variant="contained"
              sx={{
                bgcolor: "#fff",
                color: "#111",
                fontWeight: "bold",
                '&:hover': { bgcolor: "#eee" }
              }}
              fullWidth
              href={GOOGLE_AUTH_URL}
            >
              Sign in with Google
            </Button>
            <Button
              size="large"
              startIcon={<GitHubIcon />}
              variant="contained"
              sx={{
                bgcolor: "#24292e",
                color: "#fff",
                fontWeight: "bold",
                '&:hover': { bgcolor: "#444" }
              }}
              fullWidth
              href={GITHUB_AUTH_URL}
            >
              Sign in with GitHub
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
