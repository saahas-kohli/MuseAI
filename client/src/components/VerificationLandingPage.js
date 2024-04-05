import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@chakra-ui/react";

function VerificationLandingPage({}) {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      verifyEmailToken(token);
    }
  }, []);

  const verifyEmailToken = async (token) => {
    const response = await fetch(`http://localhost:9000/verify-email?token=${token}`);
    const jsonData = await response.json();
    console.log("Verifying token: ", token);
  };

  return (
    <Box>Your email has been verified! You may login to your account.</Box>
  );
}

export default VerificationLandingPage;
