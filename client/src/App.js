import { ChakraProvider } from "@chakra-ui/react";
import React, { useRef, useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

//components

import LoginForm from "./components/LoginForm.js";
import SignupForm from "./components/SignupForm.js";
import Sidebar from "./components/Sidebar.js";
import StagingArea from "./components/StagingArea.js";

const theme = extendTheme({
  components: {
    Button: { baseStyle: { _focus: { outline: "none" } } },
  },
});

function App() {
  const [selectedSong, setSelectedSong] = useState(-1);
  const [listRender, setListRender] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("todo");

  return (
    <ChakraProvider theme={theme}>
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
              ></SignupForm>
            }
          />
          <Route
            path="/home"
            element={
              loggedIn ? (
                <Flex>
                  <Box
                    className="sidebar"
                    bg="#F9F8F8"
                    w={0.172}
                    h="calc(100vh)"
                  >
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
                      ></Sidebar>
                    </Box>
                  </Box>
                  <Box w={0.828} bg="" h="calc(100vh)">
                    <StagingArea
                      selectedSong={selectedSong}
                      listRender={listRender}
                      setListRender={setListRender}
                      currentUser={currentUser}
                      setCurrentUser={setCurrentUser}
                    />
                  </Box>
                </Flex>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
