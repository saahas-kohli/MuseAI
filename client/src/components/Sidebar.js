// libraries
import { ChakraProvider } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
import { Container, Center } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Icon } from "@chakra-ui/react";
import { MdLibraryMusic } from "react-icons/md";
import React, { useState } from "react";

// components
import ListSongs from "./ListSongs";

const Sidebar = () => {
  const [listRender, setListRender] = useState(true);

  const addToList = async (e) => {
    e.preventDefault();
    try {
      const defaultDescription = "Unnamed song";
      const body = { defaultDescription };
      const response = await fetch("http://localhost:9000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      setListRender(!listRender);
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <Box overflowY="scroll" maxHeight="650px" overflowX="hidden" width="100%">
      <Box position="sticky" top="0" zIndex={1} marginLeft="4.5%" width="100%">
        <Button
          width="90%"
          justifyContent="flex-start"
          bg="#F9F8F8"
          _hover={{ bg: "#EDECED" }}
          marginTop="5.7%"
          variant="ghost"
          fontSize="14px"
          fontWeight="bold"
          _focusVisible={{ boxShadow: "none" }}
          _active={{
            transform: "scale(0.98)",
          }}
          onClick={addToList}
        >
          <Flex>
            <Box marginTop="6px">Generate new song</Box>
            <Box width="55px"></Box>
            <Box>
              <Icon as={MdLibraryMusic} w={5} h={5} marginTop="25%"></Icon>
            </Box>
          </Flex>
        </Button>
      </Box>
      <Box marginTop="10%">
        <Box marginBottom="76px">
          <ListSongs
            listRender={listRender}
            setListRender={setListRender}
          ></ListSongs>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
