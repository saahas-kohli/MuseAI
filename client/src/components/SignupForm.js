import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  Image,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OAuthButtonGroup from "./OAuthButtonGroup.js";
import PasswordField from "./PasswordField.js";
import ConfirmPasswordField from "./ConfirmPasswordField.js";

const validator = require("validator");
//const sendEmail = require('./emailSender');

const SignupForm = ({ loggedIn, setLoggedIn, currentUser, setCurrentUser }) => {
  const [emailText, setEmailText] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [dupEmailExists, setDupEmailExists] = useState(false);
  const [passwordText, setPasswordText] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const createUser = async (email, password) => {
    try {
      const response = await fetch(
        `http://3.133.141.192:9000/todos/${email}/${password}`,
        {
          method: "POST",
        }
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const emailExists = async (email, password) => {
    try {
      const response = await fetch(
        `http://3.133.141.192:9000/users/${email}/${password}`
      );
      const jsonData = await response.json();
      if (jsonData.emailExists) {
        return true;
      }
      return false;
    } catch (err) {
      console.error(err.message);
    }
  };

  const checkEmailValidity = async (email, password) => {
    if (email === "") {
      setEmailInvalid(false);
      setDupEmailExists(false);
    } else if (!validator.isEmail(email)) {
      setEmailInvalid(true);
      setDupEmailExists(false);
    } else {
      const result = await emailExists(email, password);
      setEmailInvalid(result);
      setDupEmailExists(result);
    }
  };

  const sendVerificationEmail = async (email) => {
    try {
      const response = await fetch(
        `http://3.133.141.192:9000/send-verify/${email}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Box bg="#FDFCFE" h="calc(100vh)">
      <Container
        maxW="lg"
        py={{
          base: "0",
          md: "12",
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
              <Heading size="lg">Create an account</Heading>
              <Text color="#4A5568" fontWeight={350}>
                Already have an account?{" "}
                <Link
                  href="/login"
                  color="#2A6DB0"
                  _hover={{ color: "#2A6DB0" }}
                >
                  Log in
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
                <FormControl isInvalid={emailInvalid}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    value={emailText}
                    onChange={(e) => {
                      setEmailText(e.target.value);
                      checkEmailValidity(e.target.value, "f");
                    }}
                  />
                  <FormErrorMessage>
                    {dupEmailExists
                      ? "Email is already in use."
                      : "Email format is invalid."}
                  </FormErrorMessage>
                </FormControl>
                <PasswordField
                  passwordText={passwordText}
                  setPasswordText={setPasswordText}
                />
                <ConfirmPasswordField
                  passwordText={passwordText}
                  confirmText={confirmText}
                  setConfirmText={setConfirmText}
                />
              </Stack>
              <HStack justify="space-between">
                <Checkbox defaultChecked>Remember me</Checkbox>
              </HStack>
              <Stack spacing="3">
                <Button
                  fontSize="15px"
                  fontWeight={500}
                  borderRadius="8px"
                  colorScheme="telegram"
                  onClick={() => {
                    if (
                      validator.isEmail(emailText) &&
                      passwordText !== "" &&
                      passwordText === confirmText &&
                      !emailInvalid
                    ) {
                      createUser(emailText, passwordText);
                      sendVerificationEmail(emailText);
                      //sendEmail(emailText.toLowerCase());
                      //setCurrentUser(emailText);
                      setTimeout(() => {
                        navigate("/login");
                      }, 200);
                      toast({
                        title: "Account created.",
                        description:
                          "We've sent an email verification link to " +
                          emailText.toLowerCase() +
                          ".",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                      });
                    } else {
                      toast({
                        title: "Failed to create account.",
                        description:
                          "One or more of the fields below needs revision.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                      });
                    }
                  }}
                >
                  Create account
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

export default SignupForm;
