import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Center } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { MdMoreHoriz } from "react-icons/md";
import { BsPinAngleFill } from "react-icons/bs";
import { EditIcon } from "@chakra-ui/icons";
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
import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  useEditableControls,
} from "@chakra-ui/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { GoTrash } from "react-icons/go";

const SongButton = ({
  todo,
  listRender,
  setListRender,
  deleteFromList,
  selectedSong,
  setSelectedSong,
  currentUser,
  setCurrentUser,
  canSwitchSongs,
  setCanSwitchSongs,
  playing,
  setPlaying,
  messageVisible,
  setMessageVisibility,
}) => {
  const [description, setDescription] = useState(todo.description);
  const [beingEdited, setBeingEdited] = useState(false);
  const [zMoreButton, setZMoreButton] = useState(-1);
  const [previewFocusable, setPreviewFocusable] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const containerRef = useRef(null);
  const editableRef = useRef(null);
  const previewRef = useRef(null);
  const toast = useToast({
    containerStyle: {
      marginLeft: "205px",
    },
  });

  useEffect(() => {
    if (isOpen && !isHovered) {
      onClose();
    } else if (zMoreButton === 2) {
      onClose();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleMouseDownOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setZMoreButton(-1);
      }
    };

    document.addEventListener("mousedown", handleMouseDownOutside);

    return () => {
      document.removeEventListener("mousedown", handleMouseDownOutside);
    };
  }, []);

  const updateDescription = async () => {
    try {
      setPreviewFocusable(false);
      const body = { description };
      const user = currentUser;
      const response = await fetch(
        `http://3.133.141.192:9000/todos/${user}/${todo.todo_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      setBeingEdited(false);
      setListRender(
        !listRender
      ); /* not actually re-rendering list, maybe since it's not state variable of this component? */
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Box marginLeft="4.75%" width="100%">
      <Button
        onKeyUp={(e) => e.preventDefault()}
        onClick={() => {
          if (canSwitchSongs && !playing) {
            setSelectedSong(todo.todo_id);
            setMessageVisibility(true);
          } else if (!canSwitchSongs && selectedSong !== todo.todo_id) {
            toast({
              title: "Cannot switch songs.",
              description:
                "Please wait for the current song to finish generating.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          } else if (playing && selectedSong !== todo.todo_id) {
            toast({
              title: "Cannot switch songs.",
              description: "Please pause the audio and try again.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        }}
        width="92.25%"
        height="36px"
        borderRadius={"8.5px"}
        justifyContent={"flex-start"}
        ref={containerRef}
        bg={
          selectedSong === todo.todo_id
            ? "#CDCDCD"
            : zMoreButton === 2
            ? "#EDECED"
            : "#F9F8F8"
        }
        _hover={{ bg: selectedSong === todo.todo_id ? "#CDCDCD" : "#EDECED" }}
        variant="ghost"
        fontSize="14px"
        fontWeight={440}
        letterSpacing="-0.01em"
        _focusVisible={{ boxShadow: "none" }}
        _active={{}}
        onMouseOver={() => {
          if (zMoreButton < 2) setZMoreButton(1);
        }}
        onMouseLeave={() => {
          if (zMoreButton < 2) setZMoreButton(-1);
        }}
      >
        <Flex>
          <Flex
            minWidth="190px"
            marginTop="4px"
            marginLeft="-8.5px"
            onDoubleClick={() => {
              setPreviewFocusable(true);
              setZMoreButton(-1);

              setTimeout(() => {
                if (previewRef.current) {
                  previewRef.current.focus();
                }
              }, 200);
            }}
          >
            <Editable
              isPreviewFocusable={previewFocusable}
              ref={editableRef}
              value={todo.description}
              placeholder={"Unnamed song"}
              selectAllOnFocus={false}
              onChange={(nextValue) => {
                setDescription(nextValue);
                todo.description = nextValue;
              }}
              onSubmit={() => {
                updateDescription();
              }}
              onKeyDown={(e) => {
                if (
                  e.key === " " &&
                  editableRef.current.textContent === "Unnamed song" &&
                  description !== "Unnamed song"
                ) {
                  e.preventDefault();
                }
              }}
            >
              <EditablePreview
                maxWidth="177px"
                overflowX="hidden"
                ref={previewRef}
                style={{ cursor: "pointer" }}
              />
              <EditableInput
                width="185px"
                maxHeight="26px"
                marginTop="-0.5px"
                marginBottom="2px"
                marginLeft="-3px"
                style={{
                  border: "2px solid #2562EB",
                  boxShadow: "none",
                }}
                borderRadius="0"
                backgroundColor="#EDECED"
              />
            </Editable>
          </Flex>
          <Popover
            trigger="hover"
            placement="top"
            arrowShadowColor="black"
            openDelay={325}
            closeDelay={1}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
          >
            <Box
              pos="absolute"
              right="11px"
              marginTop={
                description.length !== 0 && description.trim() === ""
                  ? previewFocusable
                    ? "7px"
                    : "1.5px"
                  : "7px"
              }
              zIndex={selectedSong === todo.todo_id ? 1 : zMoreButton}
            >
              <Menu>
                <PopoverTrigger>
                  <MenuButton
                    _focus={{ outline: "none" }}
                    onClick={(e) => {
                      setZMoreButton(zMoreButton === 2 ? 1 : 2);
                      e.stopPropagation();
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <Icon as={MdMoreHoriz} boxSize={5}></Icon>
                  </MenuButton>
                </PopoverTrigger>

                <MenuList width="102%" marginTop="-5px" marginLeft="-5.35%">
                  {/*
                  <MenuItem
                    borderColor="#005FCD"
                    marginTop="-3px"
                    borderRadius="4px"
                    icon={
                      <Icon
                        as={BsPinAngleFill}
                        marginBottom="1.5px"
                        strokeWidth={1}
                        boxSize={4}
                      ></Icon>
                    }
                    iconSpacing="9px"
                    h="38px"
                    w="95%"
                    marginLeft="5.5px"
                    _hover={{ bg: "#EDECED", border: "2px solid #005FCD" }}
                    _focus={{ outline: "none" }}
                    onClick={(e) => {
                      setZMoreButton(-1);
                      e.stopPropagation();
                    }}
                  >
                    Pin
                  </MenuItem>*/}
                  <MenuItem
                    borderColor="#005FCD"
                    marginTop="-3px"
                    w="95%"
                    marginLeft="5.5px"
                    borderRadius="4px"
                    icon={
                      <Icon
                        as={EditIcon}
                        marginBottom="1.5px"
                        strokeWidth={1}
                        boxSize={4}
                      ></Icon>
                    }
                    iconSpacing="9px"
                    h="38px"
                    _hover={{ bg: "#EDECED", border: "2px solid #005FCD" }}
                    _focus={{ outline: "none" }}
                    onClick={(e) => {
                      setPreviewFocusable(true);
                      setZMoreButton(-1);

                      setTimeout(() => {
                        if (previewRef.current) {
                          previewRef.current.focus();
                        }
                      }, 200);

                      e.stopPropagation();
                    }}
                  >
                    Rename
                  </MenuItem>
                  <MenuItem
                    borderColor="#005FCD"
                    marginTop="2px"
                    w="95%"
                    marginLeft="5.5px"
                    borderRadius="4px"
                    h="38px"
                    marginBottom="-3px"
                    _hover={{
                      bg: "#EDECED",
                      border: "2px solid #005FCD",
                    }}
                    _focus={{ outline: "none" }}
                    onClick={(e) => {
                      if (
                        selectedSong !== todo.todo_id ||
                        (canSwitchSongs && !playing)
                      ) {
                        deleteFromList(todo.todo_id);
                        if (selectedSong === todo.todo_id) {
                          setSelectedSong(-1);
                          setMessageVisibility(true);
                        }
                        e.stopPropagation();
                      } else if (!canSwitchSongs) {
                        toast({
                          title: "Cannot delete song while generating.",
                          description:
                            "Please wait for the song to render and try again.",
                          status: "error",
                          duration: 5000,
                          isClosable: true,
                        });
                      } else if (playing) {
                        toast({
                          title: "Cannot delete song while playing.",
                          description: "Please pause the audio and try again.",
                          status: "error",
                          duration: 5000,
                          isClosable: true,
                        });
                      }
                    }}
                    color="#EF4444"
                    icon={
                      <Icon
                        as={GoTrash}
                        marginBottom="1.5px"
                        strokeWidth={1}
                        boxSize={4}
                        color="#EF4444"
                      ></Icon>
                    }
                    iconSpacing="9px"
                  >
                    Delete song
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
            <PopoverContent
              bg="black"
              textColor="white"
              borderColor="black"
              maxWidth="50px"
              fontSize="11px"
              fontWeight="bold"
            >
              <PopoverArrow bg="black" />
              <PopoverBody>
                <Center>More</Center>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
      </Button>
    </Box>
  );
};

export default SongButton;
