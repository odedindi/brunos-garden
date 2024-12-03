import { useState, type FC, type ReactNode } from "react"
import {
  Marker as MapGlMarker,
  type MarkerProps as MapGlMarkerProps,
  Popup,
} from "react-map-gl"
import classes from "./map.module.css"

export interface MarkerProps extends Omit<MapGlMarkerProps, "popup"> {
  popupContent?: ReactNode
  customIcon?: ReactNode
}

const Marker: FC<MarkerProps> = ({
  popupContent,
  customIcon,
  onClick,
  ...props
}) => {
  const [showPopup, setShowPopup] = useState(false)

  return (
    <>
      <MapGlMarker
        onClick={(e) => {
          // If we let the click event propagates to the map, it will immediately close the popup with `closeOnClick: true`
          e.originalEvent.stopPropagation()

          setShowPopup((o) => !o)
          onClick?.(e)
        }}
        style={{ cursor: "pointer" }}
        {...props}
      >
        {customIcon}
      </MapGlMarker>
      {showPopup && popupContent ? (
        <Popup
          anchor="top"
          latitude={props.latitude}
          longitude={props.longitude}
          onClose={() => setShowPopup(false)}
          className={classes.popup}
        >
          {popupContent}
        </Popup>
      ) : undefined}
    </>
  )
}

export default Marker
