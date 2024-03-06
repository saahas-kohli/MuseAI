import { ChakraProvider } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
import { Container, Center, AbsoluteCenter } from "@chakra-ui/react";
import autosize from "autosize";
import React, { useRef, useState, useEffect } from "react";
import { Textarea } from "@chakra-ui/react";
import { MdArrowUpward } from "react-icons/md";
import { Icon } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

const StagingArea = () => {
  const [enteredDesc, setEnteredDesc] = useState("");
  return (
    <Box
      pos="absolute"
      bottom="0"
      width="50.75%"
      marginLeft="15.75%"
      marginBottom={8}
    >
      <AutosizeTextarea
        enteredDesc={enteredDesc}
        setEnteredDesc={setEnteredDesc}
      />
    </Box>
  );
};

const AutosizeTextarea = ({ enteredDesc, setEnteredDesc }) => {
  const ref = useRef(null);
  const [flag, setFlag] = useState(false);
  const [buttonDarkened, setButtonDarkened] = useState(false);

  useEffect(() => {
    const textarea = ref.current;
    if (textarea) {
      autosize(textarea);
      autosize.update(textarea);
      return () => {
        autosize.destroy(textarea);
      };
    }
  }, [flag, enteredDesc]);

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Prevent the default behavior (adding a new line)
      e.preventDefault();
      const textarea = ref.current;
      setEnteredDesc(textarea.value);
      textarea.value = "";
      setButtonDarkened(false);
    }
  };

  const handleEnterButton = () => {
    const textarea = ref.current;
    setEnteredDesc(textarea.value);
    textarea.value = "";
    setButtonDarkened(false);
  };

  const handleChange = () => {
    const textarea = ref.current;
    if (textarea.value === "" && buttonDarkened) setButtonDarkened(false);
    else if (textarea.value !== "" && !buttonDarkened) setButtonDarkened(true);
  };

  return (
    <Box display="flex" alignItems="center" position="relative">
      <Textarea
        onChange={handleChange}
        onKeyDown={(e) => handleEnter(e)}
        minHeight="20px"
        ref={ref}
        placeholder="Enter song description..."
        _placeholder={{
          color: "gray.500",
          fontWeight: "medium",
        }}
        color="black"
        fontWeight="normal"
        borderRadius="15px"
        borderColor="gray.300"
        _focus={{
          borderColor: "gray.300",
          outline: "none",
          boxShadow: "0 0 2px rgba(128, 128, 128, 0.5)",
        }}
        lineHeight="normal"
        paddingTop="17px"
        paddingBottom="17px"
        fontSize="16px"
        overflow="hidden"
        sx={{
          "&::placeholder": {
            color: "gray.500",
            fontWeight: "medium",
          },
          "&": {
            resize: "none",
          },
          flex: 1, // Make Textarea flexible to fill the container
        }}
      ></Textarea>
      <IconButton
        marginLeft="10px"
        backgroundColor={buttonDarkened ? "black" : "#E5E4E4"}
        textColor="white"
        size="md"
        isRound
        onClick={() => handleEnterButton()}
        _hover={{}}
        icon={<ArrowUpIcon />}
        fontSize="25px"
        aria-label="Upload text"
      ></IconButton>
    </Box>
  );
};

export default StagingArea;
