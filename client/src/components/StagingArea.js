import { useColorModeValue } from "@chakra-ui/react";
import { Box, Switch } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
import { Container, Center } from "@chakra-ui/react";
import autosize from "autosize";
import React, { useRef, useState, useEffect } from "react";
import { Link, Textarea } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { FaSun, FaMoon } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { Spinner } from "@chakra-ui/react";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { BsGithub } from "react-icons/bs";
import { Text, Icon, IconButton } from "@chakra-ui/react";
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
import { MdMoreHoriz } from "react-icons/md";
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

const OpeningMessage = () => {
  // This component handles the opening message
  return (
    <>
      <Box
        bottom="0"
        width="80%" // Adjusted width for a larger box
        height="300px" // Specify a height to make the box larger
        marginLeft="7%" // Adjusted to keep the box centered with the new width
        marginBottom={35}
        borderRadius="20px" // Added rounded edges
        overflow="hidden" // Ensure the canvas respects the Box's rounded corners
      >
        <Box
          pos="relative"
          left="0"
          marginTop="0px"
          marginLeft="135px"
          fontWeight="semibold"
          fontSize="24px"
        >
          What would you like to listen to?
        </Box>
      </Box>
    </>
  );
};

const RenderingMessage = () => {
  // This component handles the rendering message
  return (
    <>
      <Box
        bottom="0"
        width="80%" // Adjusted width for a larger box
        height="300px" // Specify a height to make the box larger
        marginLeft="7%" // Adjusted to keep the box centered with the new width
        marginBottom={35}
        borderRadius="20px" // Added rounded edges
        overflow="hidden" // Ensure the canvas respects the Box's rounded corners
      >
        <Flex
          pos="relative"
          left="0"
          marginTop="0px"
          marginLeft="230px"
          fontWeight="semibold"
          fontSize="24px"
        >
          <Box>Generating&nbsp;&nbsp;</Box>
          <Box marginTop="4px">
            <Spinner speed="0.65s" />
          </Box>
        </Flex>
        <Box></Box>
      </Box>
    </>
  );
};

let data = "Default value";

const Output = ({ canvas, audioSrc, audioRef }) => {
  return (
    <>
      <Box
        bottom="0"
        width="80%" // Adjusted width for a larger box
        height="300px" // Specify a height to make the box larger
        marginLeft="7%" // Adjusted to keep the box centered with the new width
        marginBottom={8}
        borderRadius="20px" // Added rounded edges
        overflow="hidden" // Ensure the canvas respects the Box's rounded corners
      >
        <Flex justifyContent="center" alignItems="center" height="100%">
          <canvas
            ref={canvas}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              backgroundColor: "black",
            }}
          ></canvas>
        </Flex>
      </Box>
      <Box bottom="0" width="50.75%" marginLeft="20%" marginBottom={135}>
        <Flex justifyContent="center" alignItems="center" height="100%">
          <audio controls src={audioSrc} ref={audioRef}></audio>
        </Flex>
      </Box>
    </>
  );
};

const StagingArea = ({ selectedSong, listRender, setListRender }) => {
  const [enteredDesc, setEnteredDesc] = useState("");
  const [ws, setWs] = useState(null);
  const canvas = useRef(null);
  // Control components flashing on and off the screen to make transitions look better
  const [messageVisible, setMessageVisibility] = useState(true);
  const [renderingVisible, setRenderingVisibility] = useState(false);
  const [outputVisible, setOutputVisibility] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [audioSrc, setAudioSrc] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    console.log("Prompt is '" + enteredDesc + "'");
  }, [enteredDesc]);

  useEffect(() => {
    if (canvas.current && audioRef.current) {
      const audioElement = audioRef.current;
      canvas.current.over = false;
      // Perform canvas operations here
      // DRAWING STARTS HERE
      // console.log("DATA");
      // console.log(data.output);
      // console.log("DATA");
      // Handle received message
      const ctx = canvas.current.getContext("2d");
      // canvas.current.width = window.innerWidth;
      // canvas.current.height = window.innerHeight;
      canvas.current.width = 404;
      canvas.current.height = 300;
      // ctx.fillStyle = 'rgb(100,0,0)';
      // ctx.fillRect(0, 0, 100, 100);
      let audioSource;
      let analyser;
      let audio1 = new Audio("data:audio/x-wav;base64," + data.output);

      setAudioSrc("data:audio/x-wav;base64," + data.output);

      const audioCtx = new AudioContext();

      // Event handlers
      const handlePlay = () => {
        canvas.current.over = false;
        audio1.play();
        animate();
      };

      const handleSeek = () => {
        canvas.current.over = false;
        animate();
      };

      const handleEnded = () => {
        canvas.current.over = true;
        audio1.pause();
      };

      // Attach event listeners
      audioElement.addEventListener("play", handlePlay);
      audioElement.addEventListener("playing", handleSeek);
      audioElement.addEventListener("seeked", handleSeek);
      audioElement.addEventListener("ended", handleEnded);
      audioElement.addEventListener("pause", handleEnded);

      // const playLog = () => {
      //   console.log('play');
      // };
      // const playingLog = () => {
      //   console.log('playing');
      // };
      // const seekedLog = () => {
      //   console.log('seeked');
      // };
      // const endedLog = () => {
      //   console.log('ended');
      // };

      // audioElement.addEventListener('play', playLog);
      // audioElement.addEventListener('playing', playingLog);
      // audioElement.addEventListener('seeked', seekedLog);
      // audioElement.addEventListener('ended', endedLog);

      // Start animation if audio is already playing (e.g., on component mount if audio was started elsewhere)
      if (!audioElement.paused) {
        handlePlay();
      }

      // Start the audio once at the beginning by default
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

      handlePlay();

      // function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
      //   const maxBarHeight = Math.max(...dataArray);
      //   for (let i = 0; i < bufferLength; i++) {

      //     let value = dataArray[i] > 0 ? Math.log10(dataArray[i]) : 0;
      //     let normalizedHeight = value / Math.log10(maxBarHeight);
      //     let barHeight = normalizedHeight * canvas.current.height;
      //     if (barHeight == 0) {
      //       barHeight = 200 * (1 / i)
      //     }

      //     // Create the gradient for this bar
      //     let gradientStartY = canvas.current.height - barHeight;
      //     let gradientEndY = canvas.current.height;

      //     // Ensure that the start and end Y positions are finite numbers
      //     if (!Number.isFinite(gradientStartY) || !Number.isFinite(gradientEndY)) {
      //       continue; // Skip this iteration
      //     }

      //     let gradient = ctx.createLinearGradient(0, gradientStartY, 0, gradientEndY);
      //     gradient.addColorStop(0, 'rgb(239, 246, 5)'); // Yellow at the top
      //     gradient.addColorStop(1, 'rgb(148, 0, 211)'); // Purple at the bottom

      //     ctx.fillStyle = gradient;
      //     ctx.fillRect(x, gradientStartY, barWidth, barHeight);

      //     x += barWidth;
      //   }
      // }

      function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
        const maxBarHeight = Math.max(...dataArray);

        // To increase variance, we could amplify the difference between the high and low values.
        // We calculate the exponent based on the maximum value to maintain the dynamic range.
        const exponent = maxBarHeight > 0 ? Math.log10(maxBarHeight) / 2 : 1;

        for (let i = 0; i < bufferLength; i++) {
          // Apply an exponential transformation to the dataArray values
          let value = dataArray[i] > 0 ? Math.pow(dataArray[i], exponent) : 0;
          let normalizedHeight = value / Math.pow(maxBarHeight, exponent);

          // Make sure the bar height is at least a random small value to be visible
          let barHeight = normalizedHeight * canvas.current.height;
          if (barHeight <= 1) {
            barHeight = Math.random() * 5 + 2; // Slightly higher than 0 to be visible
          }

          // Create the gradient for this bar
          let gradientStartY = canvas.current.height - barHeight;
          let gradientEndY = canvas.current.height;

          // Ensure that the start and end Y positions are finite numbers
          if (
            !Number.isFinite(gradientStartY) ||
            !Number.isFinite(gradientEndY)
          ) {
            continue; // Skip this iteration
          }

          let gradient = ctx.createLinearGradient(
            0,
            gradientStartY,
            0,
            gradientEndY
          );
          gradient.addColorStop(0, "rgb(255, 235, 205)"); // Fainter yellow at the bottom
          gradient.addColorStop(1, "rgb(128, 0, 128)"); // Purple at the top

          ctx.fillStyle = gradient;
          ctx.fillRect(x, gradientStartY, barWidth, barHeight);

          // Move to the next bar's x position
          x += barWidth;
        }
      }

      function animate() {
        // console.log("Animate was run");
        // x = 0;
        x = 0;
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
        analyser.getByteFrequencyData(dataArray);
        // console.log(dataArray);
        drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
        if (!canvas.current.over) {
          requestAnimationFrame(animate);
        }
      }

      // Cleanup function
      return () => {
        audioElement.removeEventListener("play", handlePlay);
        audioElement.removeEventListener("ended", handleEnded);
      };

      // DRAWING ENDS HERE
    }
  }, [canvasReady, audioRef]); // This effect depends on canvas.current

  useEffect(() => {
    // Initialize WebSocket connection
    const newWs = new WebSocket("ws://localhost:6789");

    newWs.onmessage = (event) => {
      setRenderingVisibility(false);
      setOutputVisibility(true);

      data = JSON.parse(event.data);
      // console.log("This is the music data log!");
      // console.log(data.output.slice(0, 20));
      prepareCanvas();
    };

    setWs(newWs);

    // Cleanup on component unmount
    return () => {
      if (newWs) {
        newWs.close();
      }
    };
  }, []);

  const prepareCanvas = () => {
    // if (canvas.current) {
    //   setCanvasReady(true);
    // }
    setCanvasReady(true);
  };

  const runMusicGen = (musicDescription) => {
    if (messageVisible) {
      setMessageVisibility(false);
    }
    if (outputVisible) {
      setOutputVisibility(false);
    }
    setCanvasReady(false);
    setRenderingVisibility(true);
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
        <Menu placement="bottom-start">
          <MenuButton
            as={Box}
            marginLeft="8px"
            marginTop="6px"
            borderRadius="12px"
            height="44px"
            width="145px"
            bg="transparent"
            _hover={{ bg: "#F9F8F8" }}
            _active={{ bg: "#F9F8F8" }}
            style={{ cursor: "pointer" }}
          >
            <Flex>
              <Box
                pos="relative"
                left="0"
                marginTop="9px"
                marginLeft="13px"
                fontWeight="semibold"
                fontSize="18px"
              >
                MuseAI
              </Box>
              <Box
                marginTop="9px"
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
                marginTop="11px"
                background="transparent"
                textColor="#9A9B9A"
                _hover={{}}
                _active={{}}
              ></IconButton>
            </Flex>
          </MenuButton>

          <MenuList
            borderRadius="8px"
            fontSize="14px"
            fontWeight={440}
            letterSpacing="-0.01em"
            width="151.5%"
            maxWidth="340px"
            height="170px"
            marginTop="-3px"
          >
            <Box marginLeft="13px" marginTop="3px" marginRight="13px">
              Welcome to MuseAI. We perform conditional music generation based
              on textual descriptions. Please input as many distinct
              characteristics of your desired song as possible. Then, our
              single-stage transformer language model will generate a brief
              audio clip and waveform visualizer based on those preferences.
              Enjoy making music!
            </Box>
          </MenuList>
        </Menu>

        <Box pos="absolute" right="0" marginTop="18px" marginRight="61px">
          <Link href="https://github.com/dfields-1" isExternal={true}>
            <Icon
              as={BsGithub}
              boxSize={5}
              color="#A1AEC1"
              _hover={{ color: "#4A5568" }}
            ></Icon>
          </Link>
        </Box>
        <Box pos="absolute" right="0" marginTop="7.5px" marginRight="12px">
          <IconButton
            variant="solid"
            aria-label="color-mode icon"
            background="transparent"
            _hover={{
              background: darkMode ? "#2D303D" : "#EDF3F7",
            }}
            _active={{
              transform: "scale(0.95)",
            }}
            fontSize={darkMode ? "24px" : "19px"}
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
        {messageVisible && <OpeningMessage />}
        {renderingVisible && <RenderingMessage />}
        {outputVisible && (
          <Output canvas={canvas} audioSrc={audioSrc} audioRef={audioRef} />
        )}

        <AutosizeTextarea
          enteredDesc={enteredDesc}
          setEnteredDesc={setEnteredDesc}
          runMusicGen={runMusicGen}
          selectedSong={selectedSong}
          listRender={listRender}
          setListRender={setListRender}
        />
      </Box>
      <Box
        color="#676666"
        fontWeight={450}
        fontSize="11.5px"
        pos="absolute"
        bottom="8px"
        marginLeft="30.25%"
        letterSpacing="-0.03em"
      >
        MuseAI may take up to a minute to compose responses.
      </Box>
    </Box>
  );
};

const AutosizeTextarea = ({
  enteredDesc,
  setEnteredDesc,
  runMusicGen,
  selectedSong,
  listRender,
  setListRender,
}) => {
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

  const updateDescription = async (description) => {
    try {
      const body = { description };
      setListRender(!listRender);
      const response = await fetch(
        `http://localhost:9000/todos/${selectedSong}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Prevent the default behavior (adding a new line)
      e.preventDefault();
      const textarea = ref.current;
      const temp = textarea.value;
      setEnteredDesc(textarea.value);
      runMusicGen(textarea.value);
      textarea.value = "";
      setButtonDarkened(false);
      updateDescription(temp);
    }
  };

  const handleEnterButton = () => {
    const textarea = ref.current;
    const temp = textarea.value;
    setEnteredDesc(textarea.value);
    runMusicGen(textarea.value);
    textarea.value = "";
    setButtonDarkened(false);
    updateDescription(temp);
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
        minHeight="5px"
        ref={ref}
        placeholder={"Enter song description..."}
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
