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

function Sidebar() {
  const [description, setDescription] = useState("New song");
  const [listRender, setListRender] = useState(true);

  const addToList = async (e) => {
    e.preventDefault();
    try {
      const body = { description };
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
    <Box overflowY="scroll" maxHeight="650px" overflowX="hidden">
      <Center position="sticky" top="0" zIndex={1}>
        <Button
          bg="#F9F8F8"
          w="90%"
          _hover={{ bg: "#EDECED" }}
          marginTop="5.7%"
          marginRight="8%"
          marginLeft="4.5%"
          variant="ghost"
          fontSize="14px"
          fontWeight="bold"
          _focusVisible={{ boxShadow: "none" }}
          _active={{
            transform: "scale(0.98)",
          }}
          onClick={addToList}
        >
          <Box pos="absolute" left="0" padding="2">
            <Flex>
              <Box w="2px"></Box>
              <Box>Generate new song</Box>
            </Flex>
          </Box>
          <Box pos="absolute" right="0" padding="2">
            <Icon as={MdLibraryMusic} w={5} h={5} marginTop="25%"></Icon>
          </Box>
        </Button>
      </Center>
      <Box marginTop="10%">
        <ListSongs
          listRender={listRender}
          setListRender={setListRender}
        ></ListSongs>
      </Box>
    </Box>
  );
}

export default Sidebar;
