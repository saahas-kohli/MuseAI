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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import OAuthButtonGroup from "./OAuthButtonGroup.js";
import PasswordField from "./PasswordField.js";
import ConfirmPasswordField from "./ConfirmPasswordField.js";

const validator = require("validator");

const SignupForm = ({ loggedIn, setLoggedIn, currentUser, setCurrentUser }) => {
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const [confirmText, setConfirmText] = useState("");

  return (
    <Box bg="#FDFCFE">
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
                <FormControl
                  isInvalid={emailText !== "" && !validator.isEmail(emailText)}
                >
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                  />
                  <FormErrorMessage>Email format is invalid.</FormErrorMessage>
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
                  onClick={() => {}}
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
