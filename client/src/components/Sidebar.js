// libraries
import { Box } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
import { Container, Center } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { MdLibraryMusic } from "react-icons/md";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Avatar } from "@chakra-ui/react";
import { avatarAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";
import { MdCellTower } from "react-icons/md";
import { MdMoreHoriz } from "react-icons/md";
import { BsPinAngleFill } from "react-icons/bs";
import { EditIcon } from "@chakra-ui/icons";
import { GoTrash } from "react-icons/go";
import { CiLogin } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { AiOutlineUser } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { BsGear } from "react-icons/bs";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";

// components
import ListSongs from "./ListSongs";

const Sidebar = ({
  selectedSong,
  setSelectedSong,
  listRender,
  setListRender,
  currentUser,
  setCurrentUser,
  loggedIn,
  setLoggedIn,
  canSwitchSongs,
  setCanSwitchSongs,
  playing,
  setPlaying,
  messageVisible,
  setMessageVisibility,
  outputVisible,
  setOutputVisibility,
  guestSession,
  setGuestSession,
}) => {
  const [defaultDescription, setDefaultDescription] = useState("");
  const navigate = useNavigate();

  const getReadyToAddNewSong = async () => {
    try {
      setSelectedSong(-1);
      setMessageVisibility(true);
      //setListRender(!listRender);
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <Box>
      <Box
        className="custom-scrollbar"
        overflowY="scroll"
        maxHeight="700px"
        minHeight="700px"
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
            onClick={() => {
              if (canSwitchSongs && !playing) {
                getReadyToAddNewSong();
              }
            }}
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
          <Box marginBottom="105px">
            <ListSongs
              listRender={listRender}
              setListRender={setListRender}
              selectedSong={selectedSong}
              setSelectedSong={setSelectedSong}
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
            ></ListSongs>
          </Box>
        </Box>
      </Box>
      <Box marginLeft="12px" width="256px" position="absolute" bottom="14px">
        <Menu placement="top-end">
          <MenuButton
            as={Button}
            _focus={{ outline: "none" }}
            _active={{ bg: "#EDECED" }}
            width="92.25%"
            height="48px"
            borderRadius="8.5px"
            bg="#F9F8F8"
            _hover={{ bg: "#EDECED" }}
            variant="ghost"
            _focusVisible={{ boxShadow: "none" }}
            justifyContent="flex-start"
          >
            <Flex marginLeft="-7.5px" maxHeight="30px">
              <Box>
                {currentUser === "todo" ? (
                  <Avatar
                    bg="black"
                    size="sm"
                    icon={<BsFillPersonFill fontSize="0.875rem" />}
                  />
                ) : (
                  <Avatar
                    bg="black"
                    textColor="white"
                    size="sm"
                    name={currentUser}
                    src=""
                  />
                )}
              </Box>
              <Box
                fontSize="14px"
                fontWeight={440}
                letterSpacing="-0.01em"
                marginTop="7.5px"
                marginLeft="7px"
              >
                {currentUser === "todo"
                  ? "Guest"
                  : currentUser.substring(0, currentUser.indexOf("@"))}
              </Box>
            </Flex>
          </MenuButton>

          <MenuList
            fontSize="14px"
            fontWeight={440}
            letterSpacing="-0.01em"
            marginBottom="-5px"
            width="105.5%"
            marginLeft="-5.55%"
          >
            <MenuItem
              borderColor="#005FCD"
              borderRadius="4px"
              icon={<Icon as={BsGear} marginBottom="1.5px" boxSize={4}></Icon>}
              iconSpacing="9px"
              h="38px"
              w="95%"
              marginLeft="5.5px"
              _hover={{ bg: "#EDECED", border: "2px solid #005FCD" }}
              _focus={{ outline: "none" }}
            >
              Settings
            </MenuItem>
            <MenuDivider></MenuDivider>
            <MenuItem
              borderColor="#005FCD"
              marginTop="5px"
              w="95%"
              marginLeft="4.5px"
              borderRadius="4px"
              h="38px"
              _hover={{
                bg: "#EDECED",
                border: "2px solid #005FCD",
              }}
              _focus={{ outline: "none" }}
              icon={
                <Icon
                  as={currentUser === "todo" ? CiLogin : CiLogout}
                  marginBottom="1.5px"
                  boxSize={5}
                ></Icon>
              }
              iconSpacing="9px"
              onClick={() => {
                if (currentUser === "todo") {
                  navigate("/login");
                } else {
                  setLoggedIn(false);
                  localStorage.removeItem("MuseAIUsername");
                  navigate("/login");
                }
              }}
            >
              {currentUser === "todo" ? "Log in" : "Log out"}
            </MenuItem>
            {currentUser === "todo" ? (
              <></>
            ) : (
              <Box fontSize="11px" color="#9A9B9A" marginLeft="16px">
                {"("}
                {currentUser}
                {")"}
              </Box>
            )}
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
};

export default Sidebar;
