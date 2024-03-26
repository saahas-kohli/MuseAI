import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from "@chakra-ui/react";
import { forwardRef, useRef } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

const PasswordField = forwardRef((props, ref) => {
  const { passwordText, setPasswordText } = props;
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = useRef(null);
  const mergeRef = useMergeRefs(inputRef, ref);
  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({
        preventScroll: true,
      });
    }
  };
  return (
    <FormControl>
      <FormLabel htmlFor="password">Password</FormLabel>
      <InputGroup>
        <InputRightElement>
          <IconButton
            variant="text"
            size="lg"
            textColor="#2A6DB0"
            aria-label={isOpen ? "Mask password" : "Reveal password"}
            icon={isOpen ? <HiEyeOff /> : <HiEye />}
            onClick={onClickReveal}
            minWidth="10px"
            minHeight="10px"
            height="17px"
            _hover={{ color: "#2D5283" }}
          />
        </InputRightElement>
        <Input
          id="password"
          value={passwordText}
          onChange={(e) => setPasswordText(e.target.value)}
          ref={mergeRef}
          name="password"
          type={isOpen ? "text" : "password"}
          autoComplete="current-password"
          required
        />
      </InputGroup>
    </FormControl>
  );
});
PasswordField.displayName = "PasswordField";

export default PasswordField;
