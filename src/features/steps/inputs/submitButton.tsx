import { FC } from "react"

import ChevronIcon from "@/ui/icons/Chevron"

const SubmitButton: FC<{
  onClick?: () => void
}> = ({ onClick }) => (
  <ChevronIcon
    size="md"
    onClick={() => {
      if (onClick) onClick()
    }}
    style={{ height: "70px" }}
    label="Submit"
  />
)

export default SubmitButton
