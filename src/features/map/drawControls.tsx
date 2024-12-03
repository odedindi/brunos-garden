import MapboxDraw, {
  type DrawCreateEvent,
  type DrawUpdateEvent,
  type DrawDeleteEvent,
} from "@mapbox/mapbox-gl-draw"
import type { FC } from "react"
import { useControl, type ControlPosition } from "react-map-gl"

export type Feature = DrawCreateEvent["features"][number]

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition

  onCreate: (e: DrawCreateEvent) => void
  onUpdate: (e: DrawUpdateEvent) => void
  onDelete: (e: DrawDeleteEvent) => void
}

export let drawRef: MapboxDraw | null = null

const DrawControl: FC<DrawControlProps> = (props) => {
  drawRef = useControl(
    ({ map }) => {
      map.on("draw.create", (e) => {
        props.onCreate(e)
      })
      map.on("draw.update", (e) => {
        props.onUpdate(e)
      })
      map.on("draw.delete", (e) => {
        props.onDelete(e)
      })
      return new MapboxDraw(props)
    },
    ({ map }) => {
      map.off("draw.create", props.onCreate)
      map.off("draw.update", props.onUpdate)
      map.off("draw.delete", props.onDelete)
    },
    { position: props.position },
  )

  return null
}
export default DrawControl
