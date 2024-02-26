//import React, { Fragment } from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

import "./App.css";

//components

import Sidebar from "./components/Sidebar.js";
import StagingArea from "./components/StagingArea.js";

const theme = extendTheme({
  components: { Button: { baseStyle: { _focus: { outline: "none" } } } },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Flex>
        <Box bg="#F9F8F8" w={0.17} h="calc(100vh)">
          <Sidebar></Sidebar>
        </Box>
        <Box flex="1" bg="" h="calc(100vh)">
          <StagingArea />
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
