// libraries
import { Box } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
import { Container, Center } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { MdLibraryMusic } from "react-icons/md";
import React, { useState } from "react";
import { IconButton, Avatar } from "@chakra-ui/react";
import { avatarAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";
import { MdCellTower } from "react-icons/md";

// components
import ListSongs from "./ListSongs";

const Sidebar = () => {
  const [listRender, setListRender] = useState(true);
  const [defaultDescription, setDefaultDescription] = useState("");

  const addToList = async (e) => {
    e.preventDefault();
    try {
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
    <Box>
      <Box
        className="custom-scrollbar"
        overflowY="scroll"
        maxHeight="650px"
        minHeight="650px"
        overflowX="hidden"
        width="100%"
      >
        <Box
          position="sticky"
          top="0"
          zIndex={1}
          marginLeft="4.75%"
          width="100%"
        >
          <Button
            width="92.25%"
            borderRadius="8.5px"
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
            <Flex marginLeft="-8.5px">
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
      <Box marginTop="28.5%" marginLeft="4.75%" width="100%">
        <Button
          width="92.25%"
          height="48px"
          borderRadius="8.5px"
          bg="#F9F8F8"
          _hover={{ bg: "#EDECED" }}
          variant="ghost"
          _focusVisible={{ boxShadow: "none" }}
          justifyContent="flex-start"
        >
          <Flex marginLeft="-8.5px">
            <Box>
              <Avatar
                background="green"
                textColor="white"
                size="sm"
                name="Saahas Kohli"
                src=""
              />
            </Box>
            <Box
              fontSize="14px"
              fontWeight={440}
              letterSpacing="-0.01em"
              marginTop="7.5px"
              marginLeft="7px"
            >
              Saahas Kohli
            </Box>
          </Flex>
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
