import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from "@chakra-ui/react";
import { forwardRef, useRef } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

const ConfirmPasswordField = forwardRef((props, ref) => {
  const { passwordText, confirmText, setConfirmText } = props;
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
    <FormControl isInvalid={confirmText !== "" && passwordText !== confirmText}>
      <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
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
          id="confirmPassword"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          ref={mergeRef}
          name="confirmPassword"
          type={isOpen ? "text" : "password"}
          autoComplete="current-password"
          required
        />
      </InputGroup>
      <FormErrorMessage>Passwords do not match.</FormErrorMessage>
    </FormControl>
  );
});
ConfirmPasswordField.displayName = "ConfirmPasswordField";

export default ConfirmPasswordField;
