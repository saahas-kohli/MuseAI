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
import { IconButton } from "@chakra-ui/react";
import { MdCellTower } from "react-icons/md";

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
          _focusVisible={{ boxShadow: "none" }}
          _active={{
            transform: "scale(0.98)",
          }}
          onClick={addToList}
        >
          <Flex>
            <Box>
              <IconButton
                backgroundColor="white"
                style={{
                  border: "1px solid #e4e4e4",
                }}
                isRound
                _hover={{}}
                size="sm"
                fontSize="18px"
                icon={<MdCellTower />}
              ></IconButton>
            </Box>
            <Box
              fontSize="13.25px"
              fontWeight="630"
              letterSpacing="-0.02em"
              marginLeft="9px"
              marginTop="8px"
            >
              New song
            </Box>
            <Box pos="absolute" right="10px" marginTop="5px">
              <Icon as={MdLibraryMusic} w={5} h={5}></Icon>
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
