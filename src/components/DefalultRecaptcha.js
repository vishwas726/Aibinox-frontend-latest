import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, FormHelperText } from "@mui/material";
import PropTypes from "prop-types";

export default function DefalultRecaptcha({ onCaptchaVerified, isLoading }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setQuestion(`${num1} + ${num2}`);
    setAnswer(num1 + num2);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const isValid = parseInt(value) === answer;
    setUserInput(value);
    setError(!isValid);
    onCaptchaVerified(isValid);
  };

  return (
    <Box>
      <Typography variant="body1" color="secondary" mb={1}>
        RECAPTCHA: {question}
      </Typography>
      <TextField
        fullWidth
        variant="standard"
        placeholder="Enter your answer"
        value={userInput}
        onChange={handleInputChange}
        error={error}
        disabled={isLoading}
      />
      {error && (
        <FormHelperText error>Incorrect answer, try again.</FormHelperText>
      )}
    </Box>
  );
}

DefalultRecaptcha.propTypes = {
  onCaptchaVerified: PropTypes.func.isRequired,
};
