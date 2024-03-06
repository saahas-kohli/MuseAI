import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Center, Spacer } from "@chakra-ui/react";
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

const SongButton = ({
  todo,
  hasTopPopper,
  listRender,
  setListRender,
  deleteFromList,
  selectedSong,
  setSelectedSong,
}) => {
  const [description, setDescription] = useState(todo.description);
  const [beingEdited, setBeingEdited] = useState(false);
  const [zMoreButton, setZMoreButton] = useState(-1);
  const containerRef = useRef(null);
  const editableRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    const handleMouseDownOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setZMoreButton(-1);
        //console.log("Hi");
      }
    };

    document.addEventListener("mousedown", handleMouseDownOutside);

    return () => {
      document.removeEventListener("mousedown", handleMouseDownOutside);
    };
  }, []);

  const updateDescription = async () => {
    try {
      console.log("Hmm");
      //setPreviewFocusable(false);
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
  /*
  useEffect(() => {
    if (previewFocusable) {
      previewRef.current.focus();
    }
  }, [previewFocusable]);
  */

  return (
    <Box marginLeft="4.5%" width="100%">
      <Button
        onKeyUp={(e) => e.preventDefault()}
        onClick={() => {
          setSelectedSong(todo.todo_id);
        }}
        width="90%"
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
          <Flex marginTop="4px">
            <Box>
              <Editable
                ref={editableRef}
                defaultValue={todo.description}
                placeholder={"Unnamed song"}
                selectAllOnFocus={false}
                onChange={(nextValue) => setDescription(nextValue)}
                onSubmit={() => updateDescription()}
                onClick={(e) => {
                  e.stopPropagation();
                }}
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
                />
                <EditableInput marginBottom="3px" />
              </Editable>
            </Box>
          </Flex>
          <Box
            pos="absolute"
            right="11px"
            marginTop="7px"
            zIndex={selectedSong === todo.todo_id ? 1 : zMoreButton}
          >
            <Menu>
              <MenuButton
                _focus={{ outline: "none" }}
                onClick={(e) => {
                  setZMoreButton(zMoreButton === 2 ? 1 : 2);
                  e.stopPropagation();
                }}
              >
                <Icon as={MdMoreHoriz} boxSize={5}></Icon>
              </MenuButton>
              <MenuList>
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
                    setZMoreButton(-1);

                    if (previewRef.current) {
                      previewRef.current.focus();
                    }

                    e.stopPropagation();
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  _hover={{ bg: "#EDECED" }}
                  _focus={{ outline: "none" }}
                  onClick={(e) => {
                    deleteFromList(todo.todo_id);
                    e.stopPropagation();
                  }}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Button>
    </Box>
  );
};

export default SongButton;
