import { ChakraProvider } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
import { Container, Center, AbsoluteCenter } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import { useRef, useEffect } from "react";
import autosize from "autosize";

function StagingArea() {
  return (
    <Box pos="absolute" bottom="0" m={2}>
      <AutosizeTextarea />
    </Box>
  );
}

function AutosizeTextarea() {
  const ref = useRef(null);

  useEffect(() => {
    // Apply autosize to adjust textarea height automatically
    autosize(ref.current);

    // Cleanup function to destroy autosize instance when component unmounts
    return () => {
      autosize.destroy(ref.current);
    };
  }, []);

  return (
    <Textarea
      ref={ref}
      minH="unset"
      height="unset"
      transition="height none"
      placeholder="Type something..."
      focusBorderColor="pink.400"
    />
  );
}

export default StagingArea;
