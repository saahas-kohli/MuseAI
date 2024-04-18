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
  useToast,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import OAuthButtonGroup from "./OAuthButtonGroup.js";
import PasswordField from "./PasswordField.js";
import { PUBLIC_IP } from "../deploy_config_client";

const LoginForm = ({
  loggedIn,
  setLoggedIn,
  currentUser,
  setCurrentUser,
  guestSession,
  setGuestSession,
}) => {
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  useEffect(() => {
    const tableName = localStorage.getItem("MuseAIUsername");
    if (tableName !== null) {
      setCurrentUser(tableName);
      setLoggedIn(true);
      if (!tableName.includes("@")) {
        setGuestSession(true);
      }
      setTimeout(() => {
        navigate("/home");
      }, 200);
    }
  }, []);

  const sendForgotPasswordEmail = async (email) => {
    try {
      const response = await fetch(
        `http://${PUBLIC_IP}:9000/forgot-password/${email}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const getUser = async (email, password) => {
    try {
      const response = await fetch(
        `http://${PUBLIC_IP}:9000/users/${email}/${password}`
      );
      const jsonData = await response.json();
      if (jsonData.emailExists && jsonData.userExists) {
        if (jsonData.emailVerified)
          return { userAuthenticated: true, userEmailVerified: true };
        return { userAuthenticated: true, userEmailVerified: false };
      }
      return { userAuthenticated: false, userEmailVerified: false };
    } catch (err) {
      console.error(err.message);
    }
  };

  const authenticateUser = async (email, password) => {
    const authenticationResult = await getUser(email, password);
    if (
      authenticationResult.userAuthenticated &&
      authenticationResult.userEmailVerified
    ) {
      setCurrentUser(email.toLowerCase());
      setLoggedIn(true);
      setTimeout(() => {
        navigate("/home");
      }, 200);
    } else if (
      authenticationResult.userAuthenticated &&
      !authenticationResult.userEmailVerified
    ) {
      toast({
        title: "Confirm your email address.",
        description: "Please check your email for a verification link.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Account could not be found.",
        description:
          "Please verify your credentials or sign up for a new account.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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
                <Text
                  fontSize="14px"
                  fontWeight="semibold"
                  color="#2A6DB0"
                  _hover={{ color: "#2D5283", cursor: "pointer" }}
                  marginTop="9px"
                  onClick={onOpen}
                >
                  Forgot password?
                </Text>
                <Modal
                  initialFocusRef={initialRef}
                  isOpen={isOpen}
                  onClose={onClose}
                  isCentered
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Send password to your email</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={5}>
                      <FormControl>
                        <Input ref={initialRef} placeholder="Email" />
                      </FormControl>
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={() => {
                          sendForgotPasswordEmail(initialRef.current.value);
                          toast({
                            title: "Account credentials sent.",
                            description:
                              "We've sent your password to " +
                              initialRef.current.value +
                              ".",
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                          });
                          onClose();
                        }}
                      >
                        Send
                      </Button>
                      <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
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
                  guestSession={guestSession}
                  setGuestSession={setGuestSession}
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
