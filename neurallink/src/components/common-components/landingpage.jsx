import React from "react";
import { Button, Box, Typography, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#111", paper: "#111" },
    text: { primary: "#fff" },
  },
  typography: {
    fontFamily: "'Montserrat', Arial, sans-serif",
    fontWeightBold: 700,
  },
});

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography variant="h2" color="white" fontWeight="bold" gutterBottom>
            NeuralLink
          </Typography>
          <Typography
            variant="h5"
            color="white"
            gutterBottom
            sx={{ opacity: 0.8, mb: 3 }}
          >
            Collaborate. Create. Build Together. Ship Faster.
          </Typography>
          <Typography variant="body1" color="white" sx={{ mb: 4, opacity: 0.8 }}>
            A platform where developers and creators unite — find teammates, launch
            ideas, and keep momentum with AI-driven insights. Build smarter, together.
          </Typography>

          <Button
            size="large"
            variant="contained"
            sx={{
              bgcolor: "#4f46e5",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#4338ca" }
            }}
            onClick={() => navigate("/login")}
          >
            Get Started
          </Button>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
