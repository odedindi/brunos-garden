import type { FC, CSSProperties } from "react"
import ChevronIcon from "@/ui/icons/Chevron"

const SubmitButton: FC<{
  style?: CSSProperties
  onClick?: () => void
}> = (props) => <ChevronIcon size="md" label="Submit" {...props} />

export default SubmitButton
