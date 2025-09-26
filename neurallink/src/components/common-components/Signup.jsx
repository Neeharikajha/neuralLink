import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Divider,
  Alert,
  CircularProgress
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { signup, loginWithGitHub } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const result = await signup(email, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGitHubLogin = async () => {
    setLoading(true);
    setError("");
    
    const result = await loginWithGitHub();
    if (!result.success) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Box
          sx={{
            width: "100%",
            p: 4,
            borderRadius: 3,
            bgcolor: "#1c1c1e"
          }}
        >
          <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* GitHub button */}
          <Button
            fullWidth
            variant="contained"
            startIcon={<GitHubIcon />}
            onClick={handleGitHubLogin}
            disabled={loading}
            sx={{
              bgcolor: "#24292e",
              color: "#fff",
              fontWeight: "bold",
              mt: 2,
              mb: 2,
              "&:hover": { bgcolor: "#444" }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Continue with GitHub"}
          </Button>

          <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }}>
            OR
          </Divider>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              margin="normal"
              InputProps={{ sx: { color: "#fff" } }}
              InputLabelProps={{ sx: { color: "#bbb" } }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              margin="normal"
              InputProps={{ sx: { color: "#fff" } }}
              InputLabelProps={{ sx: { color: "#bbb" } }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                bgcolor: "#4f46e5",
                "&:hover": { bgcolor: "#4338ca" }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
            </Button>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 2, color: "#bbb" }}>
            Already have an account? <Link href="/login">Log In</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
