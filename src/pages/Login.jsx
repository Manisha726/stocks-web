import React, { useState, useCallback } from "react";
import AuthForm from "../components/AuthForm";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle login logic
  const handleLogin = useCallback(
    async (credentials) => {
      try {
        const response = await loginUser(credentials);
        const token = response.data?.access_token;
        localStorage.setItem("token", token);
        onLogin(token);
        setError(""); // Clear error on success
        navigate("/stocks"); // Redirect to stocks page
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.msg || "Login failed!"); // Set error message
      }
    },
    [onLogin]
  );


  return (
    <AuthForm
      title="Login"
      onSubmit={handleLogin}
      error={error}
      footerLink="/register"
      footerLinkText="Register"
      footerText={"Don't have an account?"}
    />
  );
};

export default Login;
