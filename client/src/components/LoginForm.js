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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OAuthButtonGroup from "./OAuthButtonGroup.js";
import PasswordField from "./PasswordField.js";

const LoginForm = ({ loggedIn, setLoggedIn, currentUser, setCurrentUser }) => {
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const navigate = useNavigate();

  const getUser = async (email, password) => {
    try {
      const response = await fetch(
        `http://localhost:9000/users/${email}/${password}`
      );
      const jsonData = await response.json();
      if (jsonData.emailExists && jsonData.userExists) {
        return true;
      }
      return false;
    } catch (err) {
      console.error(err.message);
    }
  };

  const authenticateUser = async (email, password) => {
    const userExists = await getUser(email, password);
    if (userExists) {
      setCurrentUser(email.toLowerCase());
      setLoggedIn(true);
      setTimeout(() => {
        navigate("/home");
      }, 200);
    }
  };

  return (
    <Box bg="#FDFCFE">
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
              <Heading size="lg">Log in to your account</Heading>
              <Text color="#4A5568" fontWeight={350}>
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  color="#2A6DB0"
                  _hover={{ color: "#2A6DB0" }}
                >
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
          <Box
            py={{
              base: "0",
              sm: "8",
            }}
            px={{
              base: "4",
              sm: "10",
            }}
            bg={{
              base: "transparent",
              sm: "bg.surface",
            }}
            boxShadow={{
              base: "none",
              sm: "md",
            }}
            borderRadius={{
              base: "none",
              sm: "xl",
            }}
            backgroundColor="white"
            border="0.5px solid #F4F6F7"
            marginTop="-20px"
          >
            <Stack spacing="3">
              <Stack spacing="5">
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                  />
                </FormControl>
                <PasswordField
                  passwordText={passwordText}
                  setPasswordText={setPasswordText}
                />
              </Stack>
              <HStack justify="space-between">
                <Checkbox defaultChecked>Remember me</Checkbox>
                <Text
                  fontSize="14px"
                  fontWeight="semibold"
                  color="#2A6DB0"
                  _hover={{ color: "#2D5283", cursor: "pointer" }}
                  marginTop="9px"
                >
                  Forgot password?
                </Text>
              </HStack>
              <Stack spacing="3">
                <Button
                  fontSize="15px"
                  fontWeight={500}
                  borderRadius="8px"
                  colorScheme="telegram"
                  onClick={() => {
                    if (emailText !== "" && passwordText !== "") {
                      authenticateUser(emailText, passwordText);
                    }
                  }}
                >
                  Sign in
                </Button>
                <HStack marginTop="-8px"></HStack>
                <OAuthButtonGroup
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  loggedIn={loggedIn}
                  setLoggedIn={setLoggedIn}
                />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default LoginForm;