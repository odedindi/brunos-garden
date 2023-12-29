import { FC } from "react"
import { IconTrash } from "@tabler/icons-react"

import Icon, { IconProps } from "./Icon"
import { useDisclosure } from "@mantine/hooks"
import { Button, Modal, Text } from "@mantine/core"

const DeleteIcon: FC<
  Omit<IconProps, "label" | "bg"> & { verifyBeforeDelete?: boolean }
> = ({ onClick, size, verifyBeforeDelete, ...props }) => {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        size="auto"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        centered
      >
        <Text>Are you sure?</Text>{" "}
        <Button bg="red.9" onClick={onClick}>
          Delete <IconTrash stroke={1.5} />
        </Button>
      </Modal>
      <Icon
        label="Delete task"
        bg="red.9"
        onClick={() => {
          if (verifyBeforeDelete) return open()
          else if (onClick) onClick()
        }}
        size={size}
        {...props}
      >
        <IconTrash stroke={1.5} />
      </Icon>
    </>
  )
}

export default DeleteIcon
