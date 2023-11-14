import {
  Flex,
  IconButton,
  useEditableControls,
  ButtonGroup,
  Editable,
  EditablePreview,
  Input,
  EditableInput,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";

const DateField: FC<{
  date?: Date;
  onChange?: (nextValue: string) => void;
}> = ({ date, onChange }) => {
  const [focus, setFocus] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableDate, setEditableDate] = useState(() => date);
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
            if (onChange && editableDate) {
              onChange(editableDate.toString());
              setIsEditing(false);
            }
          }}
        />
        <IconButton
          icon={<CloseIcon />}
          {...(getCancelButtonProps() as any)}
          onClick={() => {
            setEditableDate(date);
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
      value={dayjs(editableDate).format(dateFormat)}
      onChange={(value) => setEditableDate(new Date(value))}
      onEdit={() => setIsEditing(true)}
      onEnded={() => {
        console.log("ended");
        setIsEditing(false);
      }}
      fontSize="lg"
      isPreviewFocusable={false}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
    >
      <EditablePreview />
      <Input type="date" as={EditableInput} textAlign="start" />

      {focus ? <EditableControls /> : null}
    </Editable>
  );
};

export default DateField;
