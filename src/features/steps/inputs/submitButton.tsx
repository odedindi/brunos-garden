import { FC } from "react"

import ChevronIcon from "@/ui/icons/Chevron"

const SubmitButton: FC<{
  onClick?: () => void
}> = ({ onClick }) => (
  <ChevronIcon size="md" onClick={() => onClick?.()} label="Submit" />
)

export default SubmitButton
