import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Center, Spacer, css } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { MdMoreHoriz, MdOutlineBrightnessLow } from "react-icons/md";
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
} from "@chakra-ui/react";

const SongButton = ({
  todo,
  listRender,
  setListRender,
  deleteFromList,
  selectedSong,
  setSelectedSong,
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

  const inputStyles = css({
    zIndex: 999, // Set your desired zIndex value
    // Add any other custom styles as needed
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
      const response = await fetch(
        `http://localhost:9000/todos/${todo.todo_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      setBeingEdited(false);
      setListRender(!listRender);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Box marginLeft="4.75%" width="100%">
      <Button
        onKeyUp={(e) => e.preventDefault()}
        onClick={() => {
          setSelectedSong(todo.todo_id);
        }}
        width="92.25%"
        height="36px"
        borderRadius="8.5px"
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
          <Flex marginTop="4px" marginLeft="-8.5px">
            <Editable
              isPreviewFocusable={previewFocusable}
              ref={editableRef}
              defaultValue={todo.description}
              placeholder={"Unnamed song"}
              selectAllOnFocus={false}
              onChange={(nextValue) => setDescription(nextValue)}
              onSubmit={() => updateDescription()}
              onKeyDown={(e) => {
                if (
                  e.key === " " &&
                  editableRef.current.textContent === "Unnamed song"
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
                onDoubleClick={(e) => {
                  setPreviewFocusable(true);
                  setZMoreButton(-1);

                  setTimeout(() => {
                    if (previewRef.current) {
                      previewRef.current.focus();
                    }
                  }, 200);

                  //e.stopPropagation();
                }}
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
              marginTop="7px"
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
                  <MenuItem
                    _hover={{ bg: "#EDECED" }}
                    _focus={{ outline: "none" }}
                    onClick={(e) => {
                      setZMoreButton(-1);
                      e.stopPropagation();
                    }}
                  >
                    Pin
                  </MenuItem>
                  <MenuItem
                    _hover={{ bg: "#EDECED" }}
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
                    _hover={{ bg: "#EDECED" }}
                    _focus={{ outline: "none" }}
                    onClick={(e) => {
                      deleteFromList(todo.todo_id);
                      e.stopPropagation();
                    }}
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
