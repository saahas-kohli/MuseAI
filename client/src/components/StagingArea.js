import { useColorModeValue } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
import { Container, Center } from "@chakra-ui/react";
import autosize from "autosize";
import React, { useRef, useState, useEffect } from "react";
import { Textarea } from "@chakra-ui/react";
import { ArrowUpIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
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

const StagingArea = () => {
  const [enteredDesc, setEnteredDesc] = useState("");
  return (
    <Box>
      <Box pos="absolute" right="0">
        <IconButton
          aria-label="light/dark mode switch"
          icon={<MoonIcon></MoonIcon>}
        ></IconButton>
      </Box>
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
    </Box>
  );
};

const AutosizeTextarea = ({ enteredDesc, setEnteredDesc }) => {
  const ref = useRef(null);
  const [flag, setFlag] = useState(false);
  const [buttonDarkened, setButtonDarkened] = useState(false);

  const textareaShadow = useColorModeValue(
    "0 2px 4px rgba(0, 0, 0, 0.1)",
    "0 2px 4px rgba(255, 255, 255, 0.1)"
  );

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
        color="black"
        fontWeight={420}
        borderRadius="15px"
        borderColor="#D8D9D8"
        _focus={{
          borderColor: "#BEBEBF",
          outline: "none",
          boxShadow: textareaShadow,
        }}
        lineHeight="normal"
        letterSpacing="-0.01em"
        paddingTop="17px"
        paddingBottom="17px"
        fontSize="16px"
        overflow="hidden"
        sx={{
          "&::placeholder": {
            color: "#7E7F7E",
            fontWeight: "normal",
            letterSpacing: "-0.01em",
          },
          "&": {
            resize: "none",
          },
          flex: 1, // Make Textarea flexible to fill the container
        }}
      ></Textarea>
      <Popover
        trigger="hover"
        placement="top"
        arrowShadowColor="black"
        openDelay={325}
        closeDelay={1}
      >
        <PopoverTrigger>
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
            _active={{}}
          ></IconButton>
        </PopoverTrigger>
        <PopoverContent
          bg="black"
          textColor="white"
          borderColor="black"
          maxWidth="140px"
          maxHeight="40px"
          fontSize="13px"
          fontWeight="bold"
          marginBottom="4px"
        >
          <PopoverArrow bg="black" />
          <PopoverBody>
            <Center>Send description</Center>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default StagingArea;
