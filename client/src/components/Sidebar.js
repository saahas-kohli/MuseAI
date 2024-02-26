import { ChakraProvider } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
import { Container, Center } from "@chakra-ui/react";

function Sidebar() {
  return (
    <Center>
      <Button
        bg="#F9F8F8"
        w="90%"
        _hover={{ bg: "#EDECED" }}
        marginTop="5.9%"
        variant="ghost"
        _focusVisible={{ boxShadow: "none" }}
      >
        Button
      </Button>
    </Center>
  );
}

export default Sidebar;
