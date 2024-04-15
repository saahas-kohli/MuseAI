import { ChakraProvider, useToast } from "@chakra-ui/react";
import React, { useRef, useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

//components

import LoginForm from "./components/LoginForm.js";
import SignupForm from "./components/SignupForm.js";
import Sidebar from "./components/Sidebar.js";
import StagingArea from "./components/StagingArea.js";
import VerificationLandingPage from "./components/VerificationLandingPage.js";

const theme = extendTheme({
  components: {
    Button: { baseStyle: { _focus: { outline: "none" } } },
  },
});

// Note: Accounting for window resizing is easier with percentage values for width and height CSS!

function App() {
  const [selectedSong, setSelectedSong] = useState(-1);
  const [canSwitchSongs, setCanSwitchSongs] = useState(true);
  const [listRender, setListRender] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("todo");
  const [playing, setPlaying] = useState(false);
  const [messageVisible, setMessageVisibility] = useState(true);
  const [outputVisible, setOutputVisibility] = useState(false);
  const [guestSession, setGuestSession] = useState(false);

  return (
    <ChakraProvider
      theme={theme}
      toastOptions={{
        defaultOptions: { position: "top" },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/login"
            element={
              <LoginForm
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                guestSession={guestSession}
                setGuestSession={setGuestSession}
              ></LoginForm>
            }
          />
          <Route
            path="/signup"
            element={
              <SignupForm
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                guestSession={guestSession}
                setGuestSession={setGuestSession}
              ></SignupForm>
            }
          />
          <Route
            path="/home"
            element={
              loggedIn ? (
                <Flex h="780px">
                  <Box className="sidebar" bg="#F9F8F8" w="260px">
                    <Box marginRight="4px">
                      <Sidebar
                        selectedSong={selectedSong}
                        setSelectedSong={setSelectedSong}
                        listRender={listRender}
                        setListRender={setListRender}
                        currentUser={currentUser}
                        setCurrentUser={setCurrentUser}
                        loggedIn={loggedIn}
                        setLoggedIn={setLoggedIn}
                        canSwitchSongs={canSwitchSongs}
                        setCanSwitchSongs={setCanSwitchSongs}
                        playing={playing}
                        setPlaying={setPlaying}
                        messageVisible={messageVisible}
                        setMessageVisibility={setMessageVisibility}
                        outputVisible={outputVisible}
                        setOutputVisibility={setOutputVisibility}
                        guestSession={guestSession}
                        setGuestSession={setGuestSession}
                      ></Sidebar>
                    </Box>
                  </Box>
                  <Box flex="1" bg="">
                    <StagingArea
                      selectedSong={selectedSong}
                      setSelectedSong={setSelectedSong}
                      listRender={listRender}
                      setListRender={setListRender}
                      currentUser={currentUser}
                      setCurrentUser={setCurrentUser}
                      canSwitchSongs={canSwitchSongs}
                      setCanSwitchSongs={setCanSwitchSongs}
                      playing={playing}
                      setPlaying={setPlaying}
                      messageVisible={messageVisible}
                      setMessageVisibility={setMessageVisibility}
                      outputVisible={outputVisible}
                      setOutputVisibility={setOutputVisibility}
                      guestSession={guestSession}
                      setGuestSession={setGuestSession}
                    />
                  </Box>
                </Flex>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/verify-email"
            element={<VerificationLandingPage></VerificationLandingPage>}
          />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
