import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  Image,
  Link,
} from "@chakra-ui/react";
import { PUBLIC_IP } from "../deploy_config_client";

function VerificationLandingPage({}) {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      verifyEmailToken(token);
    }
  }, []);

  const verifyEmailToken = async (token) => {
    const response = await fetch(
      `http://${PUBLIC_IP}:9000/verify-email?token=${token}`
    );
    const jsonData = await response.json();
    console.log("Verifying token: ", token);
  };

  return (
    <Box bg="#FDFCFE" h="calc(100vh)">
      <Container
        maxW="lg"
        py={{
          base: "0",
          md: "20",
        }}
        px={{
          base: "0",
          md: "8",
        }}
      >
        <Stack spacing="8">
          <Stack spacing="6">
            <Image
              marginLeft="200px"
              borderRadius="full"
              boxSize="50px"
              src="https://play-lh.googleusercontent.com/6QkECIyICDde6Mfq7r9dazvuyCvUXZN5m93WbO4CrwwbSSkOS-myvwvAafPfDnbdATE"
            ></Image>
            <Stack textAlign="center">
              <Heading size="lg">Email Verified</Heading>
              <Text color="#4A5568" fontWeight={350}>
                Thank you for verifying your email address!
                <br></br>
                You may now{" "}
                <Link
                  href="/login"
                  color="#2A6DB0"
                  _hover={{ color: "#2A6DB0" }}
                >
                  log in.
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default VerificationLandingPage;
