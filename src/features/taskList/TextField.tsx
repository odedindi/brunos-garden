import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  StackDivider,
  Text,
  Box,
  Flex,
  IconButton,
  Checkbox,
  Tag,
  useEditableControls,
  ButtonGroup,
  Editable,
  EditablePreview,
  Input,
  EditableInput,
  InputProps,
} from "@chakra-ui/react";
import { FC, LegacyRef, useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  CloseIcon,
  DragHandleIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { Task as TTask } from "@/types/Task";
import dayjs from "dayjs";

const TextField: FC<{
  value: string;
  onChange?: (nextValue: string) => void;
  type?: InputProps["type"];
}> = ({ value: initialValue, onChange, type }) => {
  const [focus, setFocus] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(() => initialValue);
  const dateFormat = isEditing ? "YYYY-MM-DD" : "DD-MM-YYYY";

  const EditableControls: FC = () => {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton
          icon={<CheckIcon />}
          {...(getSubmitButtonProps() as any)}
          onClick={() => {
            if (onChange) {
              console.log("submit");
              onChange(value);
              setIsEditing(false);
            }
          }}
        />
        <IconButton
          icon={<CloseIcon />}
          {...(getCancelButtonProps() as any)}
          onClick={() => {
            console.log("cancel");
            setValue(initialValue);
            setIsEditing(false);
          }}
        />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton
          size="sm"
          icon={<EditIcon />}
          {...(getEditButtonProps() as any)}
        />
      </Flex>
    );
  };
  return (
    <Editable
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      textAlign="center"
      value={type === "date" ? dayjs(value).format(dateFormat) : value}
      onChange={(value) => setValue(value)}
      onEdit={() => {
        setIsEditing(true);
      }}
      fontSize="2xl"
      isPreviewFocusable={false}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
      onSubmit={() => {
        console.log("submitting");
      }}
      onCancel={() => {
        console.log("canceling");
      }}
    >
      <EditablePreview />
      <Input type={type} as={EditableInput} textAlign="start" />
      {focus ? <EditableControls /> : null}
    </Editable>
  );
};

export default TextField;
