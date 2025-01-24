import React, { useState, useCallback } from "react";
import AuthForm from "../components/AuthForm";
import { registerUser } from "../services/api";
import Toast from "../components/Toast";

const Register = () => {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isToastOpen, setIsToastOpen] = useState(false);

  // Handle registration logic
  const handleRegister = useCallback(async (credentials) => {
    try {
      await registerUser(credentials);
      setError(""); // Clear error on success
      setSuccessMessage("Registration successful!"); // Set success message
      setIsToastOpen(true); // Open success toast
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Registration failed!"); // Set error message
    }
  }, []);

  // Handle toast close
  const handleToastClose = useCallback(() => {
    setIsToastOpen(false);
  }, []);

  return (
    <>
      <AuthForm
        title="Register"
        onSubmit={handleRegister}
        error={error}
        footerLink="/login"
        footerLinkText="Login"
        footerText="Already have an account?"
      />
      <Toast
        open={isToastOpen}
        onClose={handleToastClose}
        message={successMessage}
        severity="success"
      />
    </>
  );
};

export default Register;
