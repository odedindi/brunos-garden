import type { FC } from "react"
import { IconTrash } from "@tabler/icons-react"

import Icon, { type IconProps } from "./Icon"
import { useDisclosure } from "@mantine/hooks"
import { Button, Modal, Text } from "@mantine/core"

interface DeleteIconProps extends IconProps {
  verifyBeforeDelete?: boolean
}

const DeleteIcon: FC<DeleteIconProps> = ({
  onClick,
  size,
  verifyBeforeDelete,
  label = "Delete",
  bg = "red.9",
  ...props
}) => {
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false)

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        withCloseButton={false}
        size="auto"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        centered
      >
        <Text>Are you sure?</Text>{" "}
        <Button bg={bg} onClick={onClick}>
          Delete <IconTrash stroke={1.5} />
        </Button>
      </Modal>
      <Icon
        label={label}
        bg={bg}
        onClick={() => (verifyBeforeDelete ? openModal() : onClick?.())}
        size={size}
        {...props}
      >
        <IconTrash stroke={1.5} />
      </Icon>
    </>
  )
}

export default DeleteIcon
