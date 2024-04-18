import { Button, ButtonGroup, Text, Icon } from "@chakra-ui/react";
import { BsFillPersonFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { PUBLIC_IP } from "../deploy_config_client";

const providers = [
  {
    name: "Guest",
    icon: <Icon as={BsFillPersonFill} boxSize={5}></Icon>,
  },
];

const createGuestTable = async (guestName) => {
  try {
    const response = await fetch(
      `http://${PUBLIC_IP}:9000/createGuestTable/${guestName}`,
      {
        method: "POST",
      }
    );
  } catch (err) {
    console.error(err.message);
  }
};

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

const OAuthButtonGroup = ({
  loggedIn,
  setLoggedIn,
  currentUser,
  setCurrentUser,
  guestSession,
  setGuestSession,
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
            if (currentUser === "todo") {
              const guestName = generateRandomString(8);
              localStorage.setItem("MuseAIUsername", guestName);
              createGuestTable(guestName);
              setCurrentUser(guestName);
              setGuestSession(true);
            }
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
