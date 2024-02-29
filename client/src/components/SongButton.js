import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Center } from "@chakra-ui/react";
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

const SongButton = ({ todo, listRender, setListRender, deleteFromList }) => {
  const [description, setDescription] = useState(todo.description);
  const [beingEdited, setBeingEdited] = useState(false);
  const [zMoreButton, setZMoreButton] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setZMoreButton(-1);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const updateDescription = async () => {
    try {
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
    <Box>
      <Center>
        <Button
          ref={containerRef}
          bg="#F9F8F8"
          w="90%"
          _hover={{ bg: "#EDECED" }}
          marginRight="8%"
          marginLeft="4.5%"
          variant="ghost"
          fontSize="14px"
          fontWeight={440}
          _focusVisible={{ boxShadow: "none" }}
          _active={{
            bg: "#EFEFEF",
          }}
          onMouseOver={() => {
            if (zMoreButton !== 2) setZMoreButton(1);
          }}
          onMouseLeave={() => {
            if (zMoreButton !== 2) setZMoreButton(-1);
          }}
        >
          <Box pos="absolute" left="0" padding="2" marginTop="4px">
            <Flex>
              <Box w="2px"></Box>
              <Box>
                <Editable
                  defaultValue={todo.description}
                  selectAllOnFocus={false}
                  onChange={(nextValue) => setDescription(nextValue)}
                  onSubmit={(finalValue) => updateDescription()}
                >
                  <EditablePreview maxWidth="177px" overflowX="hidden" />
                  <EditableInput />
                </Editable>
              </Box>
            </Flex>
          </Box>
          <Box pos="absolute" right="0" padding="2" zIndex={zMoreButton}>
            <Menu>
              <MenuButton
                _focus={{ outline: "none" }}
                onClick={() => {
                  setZMoreButton(2);
                }}
              >
                <Icon as={MdMoreHoriz} boxSize={5} marginTop="6px"></Icon>
              </MenuButton>
              <MenuList>
                <MenuItem
                  _hover={{ bg: "#EDECED" }}
                  _focus={{ outline: "none" }}
                  onClick={() => setBeingEdited(true)}
                >
                  Pin
                </MenuItem>
                <MenuItem
                  _hover={{ bg: "#EDECED" }}
                  _focus={{ outline: "none" }}
                  onClick={() => deleteFromList(todo.todo_id)}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Button>
      </Center>
    </Box>
  );
  /*return (
    <Box>
      <button
        type="button"
        className="btn btn-warning"
        data-toggle="modal"
        data-target={`#id${todo.todo_id}`}
      >
        Edit
      </button>

      <div
        className="modal"
        id={`id${todo.todo_id}`}
        onClick={() => setDescription(todo.description)}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Todo</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></input>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-warning"
                data-dismiss="modal"
                onClick={(e) => updateDescription(e)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );*/
};

export default SongButton;
