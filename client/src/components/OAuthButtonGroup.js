import { Button, ButtonGroup, Text, Icon } from "@chakra-ui/react";
import { BsFillPersonFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const providers = [
  {
    name: "Guest",
    icon: <Icon as={BsFillPersonFill} boxSize={5}></Icon>,
  },
];

const OAuthButtonGroup = ({
  loggedIn,
  setLoggedIn,
  currentUser,
  setCurrentUser,
}) => {
  const navigate = useNavigate();

  return (
    <ButtonGroup variant="secondary" spacing="4">
      {providers.map(({ name, icon }) => (
        <Button
          border="1px solid #CAD4E0"
          borderRadius="8px"
          _hover={{ bg: "#F5F8FB" }}
          key={name}
          flexGrow={1}
          onClick={() => {
            setCurrentUser("todo");
            setLoggedIn(true);
            setTimeout(() => {
              navigate("/home");
            }, 100);
          }}
        >
          {icon}
          <Text
            fontSize="15px"
            fontWeight={500}
            marginTop="15.5px"
            marginLeft="10px"
          >
            Continue as {name}
          </Text>
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default OAuthButtonGroup;
