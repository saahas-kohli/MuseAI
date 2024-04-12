import { useColorModeValue } from "@chakra-ui/react";
import { Box, Switch } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
import { Container, Center } from "@chakra-ui/react";
import autosize from "autosize";
import React, { useRef, useState, useEffect } from "react";
import { Link, Textarea } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { BsArrowUpShort } from "react-icons/bs";
import { FaSun, FaMoon } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { Spinner } from "@chakra-ui/react";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { BsGithub } from "react-icons/bs";
import { Text, Icon, IconButton, Image } from "@chakra-ui/react";
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
  useToast,
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
import { PUBLIC_IP } from "../deploy_config_client";

let ws = new WebSocket("ws://" + PUBLIC_IP + ":8000"); // MAKE SURE PYTHON SERVER RUNS BEFORE THIS CLIENT CODE!
let data = "Default value";
console.log("Starting up Websocket!");

/*
ws.onopen = function (e) {
  console.log("Connection established.");

  setInterval(() => {
    ws.send(JSON.stringify({ prompt: "ping" }));
  }, 10000);
};
*/

const OpeningMessage = () => {
  // This component handles the opening message
  return (
    <>
      <Box
        marginBottom={35}
        width="80%" // Adjusted width for a larger box
        height="350px" // Specify a height to make the box larger
        marginLeft="7%" // Adjusted to keep the box centered with the new width
        borderRadius="20px" // Added rounded edges
        overflow="hidden" // Ensure the canvas respects the Box's rounded corners
      >
        <Box
          pos="relative"
          left="0"
          marginTop="0px"
          marginLeft="150px"
          fontWeight="semibold"
          fontSize="24px"
        >
          <Image
            marginLeft="31.5%"
            marginBottom="3%"
            borderRadius="full"
            boxSize="50px"
            src="https://play-lh.googleusercontent.com/6QkECIyICDde6Mfq7r9dazvuyCvUXZN5m93WbO4CrwwbSSkOS-myvwvAafPfDnbdATE"
          ></Image>
          <Box>What would you like to listen to?</Box>
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

const Output = ({ canvas, audioSrc, audioRef, playing, setPlaying }) => {
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
          <audio id="player" src={audioSrc} ref={audioRef}></audio>
          <Box>
            <Button
              onClick={() => {
                const audioPlayer = document.getElementById("player");
                audioPlayer.onended = function () {
                  setPlaying(false);
                };
                if (playing) {
                  audioPlayer.pause();
                } else {
                  audioPlayer.muted = true;
                  audioPlayer.play();
                }
                setPlaying(!playing);
              }}
              colorScheme={playing ? "red" : "green"}
            >
              {playing ? "Pause" : "Play"}
            </Button>
            <Link href={audioSrc} download>
              <Button>Download</Button>
            </Link>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

const StagingArea = ({
  selectedSong,
  setSelectedSong,
  listRender,
  setListRender,
  currentUser,
  setCurrentUser,
  canSwitchSongs,
  setCanSwitchSongs,
  playing,
  setPlaying,
  messageVisible,
  setMessageVisibility,
  outputVisible,
  setOutputVisibility,
}) => {
  const [enteredDesc, setEnteredDesc] = useState("");
  const canvas = useRef(null);
  // Control components flashing on and off the screen to make transitions look better
  const [renderingVisible, setRenderingVisibility] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [play, setPlay] = useState(false);
  const [audioSrc, setAudioSrc] = useState("");
  const audioRef = useRef(null);

  /*
  useEffect(() => {
    if(play) {
      handlePlay();
    }
  }, [play]);
  */

  useEffect(() => {
    console.log("Prompt is '" + enteredDesc + "'");
  }, [enteredDesc]);

  useEffect(() => {
    if (canvas.current && audioRef.current) {
      console.log("Actually rendering canvas");
      let audioElement = audioRef.current;
      canvas.current.over = false;
      let ctx = canvas.current.getContext("2d");
      canvas.current.width = 404;
      canvas.current.height = 300;
      let audioSource;
      let analyser;
      let audio1 = new Audio("data:audio/x-wav;base64," + data.output);

      setAudioSrc("data:audio/x-wav;base64," + data.output);

      let audioCtx = new AudioContext();

      setCanSwitchSongs(true);

      // Event handlers
      let handlePlay = () => {
        canvas.current.over = false;
        audio1.play();
        animate();
      };

      let handleSeek = () => {
        canvas.current.over = false;
        animate();
      };

      let handlePaused = () => {
        canvas.current.over = true;
        audio1.pause();
      };

      let handleEnded = () => {
        canvas.current.over = true;
        audio1.pause();
        // ADDING THIS
        audio1 = new Audio("data:audio/x-wav;base64," + data.output);
        setAudioSrc("data:audio/x-wav;base64," + data.output);
        // let audioCtx = new AudioContext();
        audioSource = audioCtx.createMediaElementSource(audio1);
        analyser = audioCtx.createAnalyser();
        audioSource.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 128;
        analyser.getByteFrequencyData(dataArray);
        // ADDING THIS
      };

      // Attach event listeners
      audioElement.addEventListener("play", handlePlay);
      audioElement.addEventListener("playing", handleSeek);
      audioElement.addEventListener("seeked", handleSeek);
      audioElement.addEventListener("ended", handleEnded);
      audioElement.addEventListener("pause", handlePaused);

      // Start animation if audio is already playing (e.g., on component mount if audio was started elsewhere)
      if (!audioElement.paused) {
        handlePlay();
      }

      // Start the audio once at the beginning by default
      // audio1.play();

      audioSource = audioCtx.createMediaElementSource(audio1);
      analyser = audioCtx.createAnalyser();
      audioSource.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 128;
      let bufferLength = analyser.frequencyBinCount;
      let dataArray = new Uint8Array(bufferLength);

      let barWidth =
        (canvas.current.width - canvas.current.width / 12) / bufferLength;
      let barHeight;
      let x;

      // Simple moving average smoothing function

      let drawVisualizer = (
        bufferLength,
        x,
        barWidth,
        barHeight,
        dataArray
      ) => {
        const maxBarHeight = Math.max(...dataArray);
        const exponent = maxBarHeight > 0 ? Math.log10(maxBarHeight) / 2 : 1;
        const canvasMidpoint = canvas.current.width / 2; // Calculate the midpoint of the canvas width

        for (let i = 0; i < bufferLength / 2; i++) {
          // Adjust loop to draw half as many bars
          const value = dataArray[i] > 0 ? Math.pow(dataArray[i], exponent) : 0;
          const normalizedHeight = value / Math.pow(maxBarHeight, exponent);

          let barHeight =
            normalizedHeight *
            (canvas.current.height - canvas.current.height / 15);
          if (barHeight <= 1) {
            barHeight = Math.random() * 5 + 2; // Slightly higher than 0 to be visible
          }

          const gradientStartY = canvas.current.height - barHeight;
          const gradientEndY = canvas.current.height;

          if (
            !Number.isFinite(gradientStartY) ||
            !Number.isFinite(gradientEndY)
          ) {
            continue; // Skip this iteration if the positions aren't finite numbers
          }

          const vertical = dataArray[i] * 3;
          const red = (i * vertical) / 20;
          const green = i * 4;
          const blue = vertical / 2;
          ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";

          // Calculate positions for symmetric bars
          const xPosLeft =
            canvasMidpoint - (i * (barWidth + 0.25) + barWidth) - 0.125; // Position for the left bar
          const xPosRight = canvasMidpoint + i * (barWidth + 0.25) + 0.125; // Position for the right bar

          // Draw left bar
          drawBar(xPosLeft, gradientStartY, barWidth, barHeight);

          // Draw right bar
          drawBar(xPosRight, gradientStartY, barWidth, barHeight);
        }
      };

      function drawBar(x, gradientStartY, barWidth, barHeight) {
        // Similar drawing logic as before, but using the parameters for x, gradientStartY, barWidth, and barHeight
        ctx.beginPath();
        ctx.moveTo(x, canvas.current.height);
        ctx.lineTo(x, gradientStartY + barWidth / 2);
        ctx.arcTo(
          x,
          gradientStartY,
          x + barWidth / 2,
          gradientStartY,
          barWidth / 2
        );
        ctx.arcTo(
          x + barWidth,
          gradientStartY,
          x + barWidth,
          gradientStartY + barWidth / 2,
          barWidth / 2
        );
        ctx.lineTo(x + barWidth, canvas.current.height);
        ctx.closePath();
        ctx.fill();
      }

      let animate = () => {
        // console.log("Animate was run");
        // x = 0;
        x = 10;
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
        analyser.getByteFrequencyData(dataArray);
        // console.log(dataArray);
        drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
        if (!canvas.current.over) {
          requestAnimationFrame(animate);
        }
      };

      // Cleanup function
      return () => {
        audioElement.removeEventListener("play", handlePlay);
        audioElement.removeEventListener("playing", handleSeek);
        // audioElement.removeEventListener("seeked", handleSeek);
        // audioElement.removeEventListener("ended", handleEnded);
        // audioElement.removeEventListener("pause", handlePaused);
      };

      // DRAWING ENDS HERE
    }
  }, [canvasReady, audioRef]); // This effect depends on canvas.current

  /*
  useEffect(() => {
    console.log(selectedSong);
  }, [selectedSong]);
  */

  // Send a fetch request to Express event handler
  const updateAudio = async () => {
    try {
      const user = currentUser;
      //console.log(selectedSong);
      const id = selectedSong;
      const audioData = data.output;
      //console.log(audioData.substring(0, 20) + " " + audioData.length);
      const body = { audioData };
      const response = await fetch(
        `http://${PUBLIC_IP}:9000/audio/${user}/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  // Send a fetch request to Express event handler
  const getAudio = async () => {
    try {
      const user = currentUser;
      const id = selectedSong;
      const response = await fetch(
        `http://${PUBLIC_IP}:9000/audio/${user}/${id}`
      );
      const jsonData = await response.json();
      if (jsonData.exists && jsonData.audioData !== null) {
        data = { output: "" };
        data.output = jsonData.audioData;
        return true;
      }
      return false;
    } catch (err) {
      console.error(err.message);
    }
  };

  // useEffect(() => {
  //   ws.onmessage = (event) => {
  //     //console.log(selectedSong);
  //     setRenderingVisibility(false);
  //     setOutputVisibility(true);
  //     // Data.output changes here
  //     data = JSON.parse(event.data);

  //     updateAudio();
  //     prepareCanvas();

  //     // console.log("This is the music data log!");
  //     // console.log(data.output.slice(0, 20));
  //   };
  // }, []);

  useEffect(() => {
    ws.onmessage = (event) => {
      //console.log(selectedSong);
      setRenderingVisibility(false);
      setOutputVisibility(true);
      // Data.output changes here
      data = JSON.parse(event.data);

      updateAudio();
      prepareCanvas();

      // console.log("This is the music data log!");
      // console.log(data.output.slice(0, 20));
    };
  }, [currentUser, selectedSong]);

  useEffect(() => {
    setOutputVisibility(false);
    setCanvasReady(false);
    setTimeout(() => {}, 100);
    async function myFunc() {
      console.log("Attempt fetch audio");
      const audioRetrieved = await getAudio();
      if (audioRetrieved) {
        console.log("Preparing canvas");
        //setRenderingVisibility(false);
        setMessageVisibility(false);
        setOutputVisibility(true);
        prepareCanvas();
      }
    }
    myFunc();

    //setWs(newWs);

    // Cleanup on component unmount
    /*
    return () => {
      if (newWs) {
        newWs.close();
      }
    };
    */
  }, [selectedSong]);

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
      const thisData = { prompt: musicDescription };
      ws.send(JSON.stringify(thisData));
    } else {
      console.log("WebSocket is not connected. Reconnecting...");
      ws = new WebSocket("ws://" + PUBLIC_IP + ":8000");
      ws.onmessage = (event) => {
        //console.log(selectedSong);
        setRenderingVisibility(false);
        setOutputVisibility(true);
        // Data.output changes here
        data = JSON.parse(event.data);

        updateAudio();
        prepareCanvas();

        // console.log("This is the music data log!");
        // console.log(data.output.slice(0, 20));
      };
      setTimeout(() => {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
          setTimeout(() => {
            runMusicGen(musicDescription);
          }, 5000);
        } else runMusicGen(musicDescription);
      }, 10000);
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
          <Output
            canvas={canvas}
            audioSrc={audioSrc}
            audioRef={audioRef}
            play={play}
            setPlay={setPlay}
            playing={playing}
            setPlaying={setPlaying}
          />
        )}

        <AutosizeTextarea
          enteredDesc={enteredDesc}
          setEnteredDesc={setEnteredDesc}
          runMusicGen={runMusicGen}
          selectedSong={selectedSong}
          setSelectedSong={setSelectedSong}
          listRender={listRender}
          setListRender={setListRender}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          canSwitchSongs={canSwitchSongs}
          setCanSwitchSongs={setCanSwitchSongs}
          playing={playing}
          setPlaying={setPlaying}
        />
      </Box>
      <Box
        color="#676666"
        fontWeight={450}
        fontSize="11.5px"
        pos="absolute"
        bottom="8px"
        marginLeft="31.1%"
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
  setSelectedSong,
  listRender,
  setListRender,
  currentUser,
  setCurrentUser,
  canSwitchSongs,
  setCanSwitchSongs,
  playing,
  setPlaying,
}) => {
  const ref = useRef(null);
  const [flag, setFlag] = useState(false);
  const [buttonDarkened, setButtonDarkened] = useState(false);
  const toast = useToast({
    containerStyle: {
      marginLeft: "205px",
    },
  });

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
      console.log(description + " AND " + selectedSong);
      const body = { description };
      const user = currentUser;
      const response = await fetch(
        `http://${PUBLIC_IP}:9000/todos/${user}/${selectedSong}`,
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

  const addNewSong = async (defaultDescription) => {
    try {
      const body = { defaultDescription };
      const user = currentUser;
      const response = await fetch(`http://${PUBLIC_IP}:9000/todos/${user}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const newSongId = await response.json();
      setSelectedSong(newSongId);
      setListRender(!listRender);
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
      if (temp !== "" && canSwitchSongs && !playing) {
        if (selectedSong === -1) {
          addNewSong(temp);
        } else {
          updateDescription(temp);
        }
        setCanSwitchSongs(false);
        setListRender(!listRender);
        setEnteredDesc(textarea.value);
        runMusicGen(textarea.value);
        textarea.value = "";
        setButtonDarkened(false);
      } else if (!canSwitchSongs) {
        toast({
          title: "Cannot generate song.",
          description: "Please wait for the current song to finish generating.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (playing) {
        toast({
          title: "Cannot generate song.",
          description: "Please pause the audio and try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleEnterButton = () => {
    const textarea = ref.current;
    const temp = textarea.value;
    if (temp !== "" && canSwitchSongs && !playing) {
      if (selectedSong === -1) {
        addNewSong(temp);
      } else {
        updateDescription(temp);
      }
      setCanSwitchSongs(false);
      setEnteredDesc(textarea.value);
      runMusicGen(textarea.value);
      textarea.value = "";
      setButtonDarkened(false);
    } else if (!canSwitchSongs) {
      toast({
        title: "Cannot generate song.",
        description: "Please wait for the current song to finish generating.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (playing) {
      toast({
        title: "Cannot generate song.",
        description: "Please pause the audio and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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
        paddingRight="48px"
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
            zIndex={1}
            position="absolute"
            right="12px"
            backgroundColor={buttonDarkened ? "black" : "#E5E4E4"}
            textColor="white"
            height="30px"
            minWidth="30px"
            borderRadius="8px"
            onClick={() => handleEnterButton()}
            _hover={{}}
            icon={<BsArrowUpShort strokeWidth="0.25px" />}
            fontSize="27px"
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
