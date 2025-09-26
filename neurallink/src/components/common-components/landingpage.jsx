// import React from "react";
// import { Button, Box, Typography, Container } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { useNavigate } from "react-router-dom";

// const darkTheme = createTheme({
//   palette: {
//     mode: "dark",
//     background: { default: "#111", paper: "#111" },
//     text: { primary: "#fff" },
//   },
//   typography: {
//     fontFamily: "'Montserrat', Arial, sans-serif",
//     fontWeightBold: 700,
//   },
// });

// export default function LandingPage() {
//   const navigate = useNavigate();

//   return (
//     <ThemeProvider theme={darkTheme}>
//       <Box
//         sx={{
//           minHeight: "100vh",
//           background: "#111",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Container maxWidth="sm" sx={{ textAlign: "center" }}>
//           <Typography variant="h2" color="white" fontWeight="bold" gutterBottom>
//             NeuralLink
//           </Typography>
//           <Typography
//             variant="h5"
//             color="white"
//             gutterBottom
//             sx={{ opacity: 0.8, mb: 3 }}
//           >
//             Collaborate. Create. Build Together. Ship Faster.
//           </Typography>
//           <Typography variant="body1" color="white" sx={{ mb: 4, opacity: 0.8 }}>
//             A platform where developers and creators unite — find teammates, launch
//             ideas, and keep momentum with AI-driven insights. Build smarter, together.
//           </Typography>

//           <Button
//             size="large"
//             variant="contained"
//             sx={{
//               bgcolor: "#4f46e5",
//               fontWeight: "bold",
//               "&:hover": { bgcolor: "#4338ca" }
//             }}
//             onClick={() => navigate("/login")}
//           >
//             Get Started
//           </Button>
//         </Container>
//       </Box>
//     </ThemeProvider>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Box,
  Typography,
  Container,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function LandingPage() {
  const navigate = useNavigate();

  // Rotating headline content
  const titles = ["NeuralLink", "Collaborate", "Work", "Join", "Create", "Build"];
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 5000); // 5 seconds
    return () => clearInterval(id);
  }, []); // setInterval + cleanup avoids memory leaks on unmount
  // Ref: setInterval + cleanup pattern for React updates [web:20]

  // Theme toggle (light by default)
  const [mode, setMode] = useState("light");
  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

  const primary = "#4f46e5";
  const primaryHover = "#4338ca";

  // useMemo for stable theme object across renders, recalculated on mode change [web:9]
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                background: { default: "#f8fafc", paper: "#ffffff" },
                text: { primary: "#0f172a", secondary: "#334155" },
              }
            : {
                background: { default: "#0b0f1a", paper: "#0b0f1a" },
                text: { primary: "#ffffff", secondary: alpha("#ffffff", 0.75) },
              }),
          primary: { main: primary },
        },
        typography: {
          fontFamily: "'Montserrat', Arial, sans-serif",
          fontWeightBold: 700,
          h2: { letterSpacing: "0.5px", fontWeight: 800 },
        },
        shape: { borderRadius: 14 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                borderRadius: 12,
                paddingInline: 20,
                paddingBlock: 10,
                boxShadow:
                  mode === "light"
                    ? "0 6px 20px rgba(79,70,229,0.18)"
                    : "0 8px 24px rgba(79,70,229,0.35)",
              },
              containedPrimary: {
                backgroundColor: primary,
                ":hover": { backgroundColor: primaryHover },
              },
              outlined: {
                borderWidth: 2,
                ":hover": { borderWidth: 2 },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 600,
              },
            },
          },
        },
      }),
    [mode]
  ); // Palette customization pattern per MUI docs [web:24]

  const isLight = mode === "light";

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle decorative gradient blobs */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: -200,
            background: `radial-gradient(800px 400px at 80% 20%, ${alpha(
              primary,
              isLight ? 0.12 : 0.22
            )} 0%, transparent 60%),
                         radial-gradient(600px 320px at 20% 80%, ${alpha(
                           "#22d3ee",
                           isLight ? 0.10 : 0.18
                         )} 0%, transparent 60%)`,
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        {/* Top bar with theme switch */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Chip
            label="Build smarter"
            size="small"
            sx={{
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              bgcolor: isLight ? alpha(primary, 0.08) : alpha("#fff", 0.08),
              color: isLight ? primary : "#fff",
              borderColor: isLight ? alpha(primary, 0.2) : alpha("#fff", 0.2),
              borderWidth: 1,
              borderStyle: "solid",
              backdropFilter: "saturate(140%)",
            }}
          />

          <IconButton
            aria-label="Toggle theme"
            onClick={toggleMode}
            sx={{
              color: isLight ? primary : "#fff",
              bgcolor: isLight ? alpha(primary, 0.08) : alpha("#fff", 0.06),
              ":hover": {
                bgcolor: isLight ? alpha(primary, 0.14) : alpha("#fff", 0.12),
              },
              borderRadius: 2,
            }}
          >
            {isLight ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Box>

        <Container maxWidth="sm" sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Animated title */}
          <Box sx={{ mb: 2, minHeight: 76 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                color: isLight ? "#0b0f1a" : "#fff",
                textShadow: isLight ? "none" : `0 2px 18px ${alpha(primary, 0.4)}`,
                transition: "opacity 400ms ease, transform 400ms ease",
              }}
              key={titles[titleIndex]}
            >
              {titles[titleIndex]}
            </Typography>
          </Box>

          <Typography
            variant="h5"
            sx={{
              color: "text.primary",
              opacity: 0.9,
              mb: 2,
              fontWeight: 600,
              letterSpacing: "0.2px",
            }}
          >
            Collaborate. Create. Build together. Ship faster.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mb: 4,
              lineHeight: 1.7,
              maxWidth: 560,
              mx: "auto",
            }}
          >
            A platform where developers and creators unite — find teammates, launch ideas, and sustain momentum with AI-driven insights. Build smarter, together.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 6 }}
          >
            <Button
              size="large"
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
            <Button
              size="large"
              variant="outlined"
              onClick={() => navigate("/about")}
              sx={{
                borderColor: isLight ? alpha("#0f172a", 0.18) : alpha("#ffffff", 0.25),
                color: "text.primary",
              }}
            >
              Learn More
            </Button>
          </Stack>

          <Box
            sx={{
              mx: "auto",
              maxWidth: 680,
              px: 3,
              py: 2.5,
              borderRadius: 3,
              bgcolor: "background.paper",
              boxShadow: isLight
                ? "0 8px 30px rgba(2,6,23,0.06)"
                : "0 10px 36px rgba(0,0,0,0.45)",
              border: `1px solid ${
                isLight ? "rgba(2,6,23,0.06)" : "rgba(255,255,255,0.08)"
              }`,
            }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Trusted by teams building hackathon projects, MVPs, and open‑source tools. Form focused squads and keep shipping with measurable momentum.
            </Typography>
          </Box>
        </Container>

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            bgcolor: isLight ? alpha("#0f172a", 0.06) : alpha("#ffffff", 0.08),
          }}
        />
      </Box>
    </ThemeProvider>
  );
}
