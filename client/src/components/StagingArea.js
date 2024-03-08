import { useColorModeValue } from "@chakra-ui/react";
import { Box, Switch } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
import { Container, Center } from "@chakra-ui/react";
import autosize from "autosize";
import React, { useRef, useState, useEffect } from "react";
import { Textarea } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { FaSun, FaMoon } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
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
  const [ws, setWs] = useState(null);
  const canvas = useRef(null);

  useEffect(() => {
    console.log(enteredDesc);
  }, [enteredDesc]);

  useEffect(() => {
    // Initialize WebSocket connection
    const newWs = new WebSocket("ws://localhost:6789");

    newWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data.output.slice(0, 20));
      // Handle received message
      const ctx = canvas.current.getContext("2d");
      // canvas.current.width = window.innerWidth;
      // canvas.current.height = window.innerHeight;
      canvas.current.width = 800;
      canvas.current.height = 400;
      // ctx.fillStyle = 'rgb(100,0,0)';
      // ctx.fillRect(0, 0, 100, 100);
      let audioSource;
      let analyser;
      let audio1 = new Audio("data:audio/x-wav;base64," + data.output);
      const audioCtx = new AudioContext();
      audio1.play();
      audioSource = audioCtx.createMediaElementSource(audio1);
      analyser = audioCtx.createAnalyser();
      audioSource.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 64;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const barWidth = canvas.current.width / bufferLength;
      let barHeight;
      let x;

      function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];
          const red = (i * barHeight) / 20;
          const green = i * 4;
          const blue = barHeight / 2;
          ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
          // console.log('barWidth' + barWidth);
          // console.log('barHeight' + barHeight);
          // ctx.fillRect(x, -(canvas.height - barHeight), barWidth, barHeight);
          ctx.fillRect(
            x,
            canvas.current.height - barHeight,
            barWidth,
            barHeight
          );
          x += barWidth;
        }
      }

      function animate() {
        console.log("Animate was run");
        // x = 0;
        x = 0;
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
        analyser.getByteFrequencyData(dataArray);
        console.log(dataArray);
        drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
        requestAnimationFrame(animate);
      }
      animate();
    };

    setWs(newWs);

    // Cleanup on component unmount
    return () => {
      if (newWs) {
        newWs.close();
      }
    };
  }, []);

  const runMusicGen = (musicDescription) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const data = { prompt: musicDescription };
      ws.send(JSON.stringify(data));
    } else {
      console.error("WebSocket is not connected.");
    }
  };

  const [darkMode, setDarkMode] = useState(false);

  return (
    <Box>
      <Flex>
        <Box
          pos="relative"
          left="0"
          marginTop="15px"
          marginLeft="21px"
          fontWeight="semibold"
          fontSize="18px"
        >
          MuseAI
        </Box>
        <Box
          marginTop="15px"
          marginLeft="5px"
          fontWeight="semibold"
          fontSize="18px"
          color="#676666"
        >
          Beta
        </Box>
        <IconButton
          icon={<FaChevronDown />}
          size="xs"
          marginTop="17px"
          background="transparent"
          textColor="#9A9B9A"
          _hover={{}}
          _active={{}}
        ></IconButton>
        <Box pos="absolute" right="0" marginTop="7.5px" marginRight="12px">
          <IconButton
            variant="solid"
            aria-label="color-mode icon"
            background={"transparent"}
            _hover={{
              background: darkMode ? "#2D303D" : "#EDF3F7",
            }}
            _active={{
              transform: "scale(0.95)",
            }}
            fontSize={darkMode ? "23px" : "18px"}
            textColor={"#A1AEC1"}
            borderRadius="5.5px"
            onClick={() => setDarkMode(!darkMode)}
            icon={darkMode ? <FaSun></FaSun> : <FaMoon></FaMoon>}
          />
        </Box>
      </Flex>

      <Box
        pos="absolute"
        bottom="0"
        width="50.75%"
        marginLeft="15.75%"
        marginBottom={8}
      >
        <Box>
          <canvas ref={canvas}></canvas>
          <audio controls></audio>
        </Box>
        <AutosizeTextarea
          enteredDesc={enteredDesc}
          setEnteredDesc={setEnteredDesc}
          runMusicGen={runMusicGen}
        />
      </Box>
    </Box>
  );
};

const AutosizeTextarea = ({ enteredDesc, setEnteredDesc, runMusicGen }) => {
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
      runMusicGen(textarea.value);
      textarea.value = "";
      setButtonDarkened(false);
    }
  };

  const handleEnterButton = () => {
    const textarea = ref.current;
    setEnteredDesc(textarea.value);
    runMusicGen(textarea.value);
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
