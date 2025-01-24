import React, { useState, useMemo, useCallback } from "react";
import { TextField, Button, Box, Typography, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AuthForm = ({
  title,
  onSubmit,
  error,
  footerText,
  footerLink,
  footerLinkText,
}) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  }, []);

  const isFormValid = useMemo(
    () => credentials.username.trim() && credentials.password.trim(),
    [credentials]
  );

  const handleSubmit = useCallback(async () => {
    if (!isFormValid) {
      alert("Please fill out all fields.");
      return;
    }
    setLoading(true); // Start loading
    try {
      await onSubmit(credentials);
      // Reset credentials only after a successful submit
      setCredentials({ username: "", password: "" });
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  }, [isFormValid, onSubmit, credentials]);

  const renderFooter = useCallback(
    () => (
      <Typography variant="body2" align="center">
        {footerText}{" "}
        <Typography
          component="span"
          sx={{
            cursor: "pointer",
            color: "primary.main",
          }}
          onClick={() => navigate(footerLink)}
        >
          {footerLinkText}
        </Typography>
      </Typography>
    ),
    [footerText, footerLink, footerLinkText, navigate]
  );


  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      sx={{
        width: "100%",
        maxWidth: "400px",
        mx: "auto", // Centers the form horizontally
        mt: 4, // Adds margin on top
        px: 2, // Adds padding for smaller screens
        "@media (max-width: 600px)": {
          gap: 1.5, // Smaller gap on small screens
          mt: 2, // Reduced top margin on small screens
        },
      }}
    >
      <Typography variant="h5" align="center">
        {title}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Username"
        name="username"
        value={credentials.username}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={credentials.password}
        onChange={handleChange}
        fullWidth
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!isFormValid}
        fullWidth
        sx={{
          py: 1.5, // Increases button padding
          "@media (max-width: 600px)": {
            py: 1,
          },
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : title}
      </Button>
      {renderFooter() && <Box mt={2}>{renderFooter()}</Box>}
    </Box>
  );
};

export default AuthForm;
