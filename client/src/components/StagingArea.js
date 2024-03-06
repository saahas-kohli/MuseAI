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

  const handleChange = () => {
    const textarea = ref.current;
    if (textarea) {
      const cursorPosition = textarea.selectionStart;
      const lines = textarea.value.split("\n");
      const currentLineNumber = textarea.value
        .substr(0, cursorPosition)
        .split("\n").length;
      const currentLine = lines[currentLineNumber - 1];

      // Create a temporary span element with the same styles as the textarea
      const tempSpan = document.createElement("span");
      tempSpan.style.cssText = window.getComputedStyle(textarea).cssText;
      tempSpan.style.position = "absolute";
      tempSpan.style.visibility = "hidden";
      tempSpan.innerText = currentLine;

      // Append the span to the body to calculate its width
      document.body.appendChild(tempSpan);

      // Get the width of the span (width of the current line)
      const lineWidth = tempSpan.getBoundingClientRect().width;

      // Remove the temporary span element
      document.body.removeChild(tempSpan);

      console.log("Width of the current line:", lineWidth);

      if (!flag && lineWidth > 690) {
        textarea.value =
          textarea.value.substr(0, textarea.value.length - 1) +
          "\n" +
          textarea.value.substr(textarea.value.length - 1);
        setFlag(true);
      } else {
        setFlag(false);
      }
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Prevent the default behavior (adding a new line)
      e.preventDefault();
      const textarea = ref.current;
      setEnteredDesc(textarea.value);
      textarea.value = "";
    }
  };

  const handleEnterButton = (e) => {
    const textarea = ref.current;
    setEnteredDesc(textarea.value);
    textarea.value = "";
  };

  return (
    <Box display="flex" alignItems="center" position="relative">
      <Textarea
        onChange={handleChange}
        onKeyDown={handleEnter}
        minHeight="20px"
        cols="50px"
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
        fontSize="md"
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
      <Button
        zIndex={1}
        pos="absolute"
        bottom="12px"
        right="12px"
        ml={2} // Margin left to create space between the Textarea and Button
        backgroundColor="black" // Black button with transparency effects
        color="white"
        variant="ghost"
        minWidth="5px"
        minHeight="5px"
        width="5px"
        height="30px"
        onClick={(e) =>
          // Define your button click event here
          handleEnterButton(e)
        }
        _hover={{ backgroundColor: "black" }}
      >
        <Icon as={MdArrowUpward} boxSize={5}></Icon>
      </Button>
    </Box>
  );
};

export default StagingArea;
