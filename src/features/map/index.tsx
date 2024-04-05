import { map, set } from "lodash"
import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import MapGl, {
  Marker,
  ScaleControl,
  NavigationControl,
  GeolocateControl,
  Popup,
  MapRef,
  useControl,
  useMap,
} from "react-map-gl"

import { INITIAL_VIEW_STATE } from "./map.config"
import { GeoJsonLayer, ArcLayer, DeckProps } from "deck.gl"
import { MapboxOverlay as DeckOverlay } from "@deck.gl/mapbox"
import DrawControl, { drawRef } from "./drawControls"
import { useMe } from "@/hooks/useMe"
import { DrawCreateEvent, DrawUpdateEvent } from "@mapbox/mapbox-gl-draw"
import { User, UserSchema } from "@/types/User"
import MapStyleMenu, { mapStyles } from "./mapStyleMenu"
import MyGardenMenu, { fieldColors } from "./myGardenMenu"
import { Box, Button } from "@mantine/core"

const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

const DeckGLOverlay: FC<DeckProps> = (props) => {
  const overlay = useControl(() => new DeckOverlay(props))
  overlay.setProps(props)
  return null
}

let updateGardenLocation = false
let myGardenLocationFeatureId: string | null = null

const Map: FC = () => {
  const { me, updateMe } = useMe()
  const mapRef = useRef<MapRef>(null)
  const { current: map } = useMap()

  const [mapStyle, setMapStyle] = useState(mapStyles[0].url)

  const onClick = (info: any) => {
    console.log({ info })
    if (info.object) {
      // eslint-disable-next-line
      alert(`${info.object.properties.name}`)
    }
  }

  const [myGardenSettings, setMyGardenSettings] = useState({
    visible: true,
    radius: 25,
    fieldColorIndex: 0,
    fieldColorAlpha: 100,
  })
  const layers = useMemo(
    () => [
      new GeoJsonLayer({
        id: "myGarden",
        data: me?.gardenLocation ?? [],
        filled: true,
        pointRadiusScale: myGardenSettings.radius,
        getFillColor: [
          ...fieldColors[myGardenSettings.fieldColorIndex].fillColor,
          myGardenSettings.fieldColorAlpha,
        ],
        // Interactive props
        highlightColor: [
          ...fieldColors[
            (myGardenSettings.fieldColorIndex + 1) % fieldColors.length
          ].fillColor,
          myGardenSettings.fieldColorAlpha,
        ],
        // pickable: true,
        // autoHighlight: true,
        // onClick,
        beforeId: "waterway-label", // In interleaved mode render the layer under map labels
        visible: myGardenSettings.visible,
        stroked: false,
      }),
    ],
    [me, myGardenSettings],
  )

  const [features, setFeatures] = useState<{ [key: string]: any }>({})

  useEffect(() => {
    console.log("me", me)
    if (me?.gardenLocation?.id) myGardenLocationFeatureId = me.gardenLocation.id
  }, [me])

  const onUpdate = async (e: DrawUpdateEvent | DrawCreateEvent) => {
    console.log("[onUpdate]: ", { e })
    console.log("[updateGardenLocation]: ", updateGardenLocation)
    const feature = e.features[0]
    console.log("[feature]: ", feature)

    if (updateGardenLocation || feature.id === myGardenLocationFeatureId) {
      const parsedUpdatedMe = UserSchema.safeParse({
        ...me,
        gardenLocation: {
          ...feature,
          properties: { ...feature.properties, name: "gardenLocation" },
        },
      })

      if (!parsedUpdatedMe.success) console.info(parsedUpdatedMe.error)
      else {
        console.log("[parsedUpdatedMe]: ", { parsedUpdatedMe })
        const res = await updateMe(parsedUpdatedMe.data)
        if (res) {
          myGardenLocationFeatureId = parsedUpdatedMe.data.gardenLocation!.id
          updateGardenLocation = false
          drawRef?.delete?.(myGardenLocationFeatureId)
        }
      }
    }
    // setFeatures((currFeatures) => {
    //   const newFeatures = { ...currFeatures }
    //   for (const f of e.features) {
    //     newFeatures[f.id!] = f
    //   }
    //   return newFeatures
    // })
  }

  const onDelete = useCallback((e: any) => {
    console.log("delete", e.features)

    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures }
      for (const f of e.features) {
        delete newFeatures[f.id]
      }
      return newFeatures
    })
  }, [])
  return (
    <Box style={{ width: "800px", height: "600px" }}>
      <MapStyleMenu
        activeMapStyleUrl={mapStyle}
        onChange={(mapStyleUrl) => setMapStyle(mapStyleUrl)}
      />
      <MyGardenMenu
        toMyGarden={
          me?.gardenLocation
            ? () => {
                mapRef.current?.flyTo({
                  center: me.gardenLocation!.geometry.coordinates,
                  zoom: 19,
                  essential: true,
                })
              }
            : undefined
        }
        gardenVisible={
          me?.gardenLocation ? myGardenSettings.visible : undefined
        }
        setGardenVisible={(visible) =>
          setMyGardenSettings((settings) => ({ ...settings, visible }))
        }
        gardenRadius={me?.gardenLocation ? myGardenSettings.radius : undefined}
        setGardenRadius={(radius) =>
          setMyGardenSettings((settings) => ({ ...settings, radius }))
        }
        fieldColorIndex={myGardenSettings.fieldColorIndex}
        setFieldColor={(fieldColorIndex) =>
          setMyGardenSettings((settings) => ({ ...settings, fieldColorIndex }))
        }
        fieldColorAlpha={myGardenSettings.fieldColorAlpha}
        setFieldColorAlpha={(fieldColorAlpha) =>
          setMyGardenSettings((settings) => ({ ...settings, fieldColorAlpha }))
        }
      />

      {/* <button
        onClick={() => {
          console.log({
            center: mapRef.current?.snapToNorth(),
            drawRef: drawRef?.getAll(),
          })
        }}
      >
        get bounds
      </button> */}
      <Button
        ml={1}
        h={28}
        onClick={() => {
          if (!drawRef) {
            console.info(
              "drawRef is null, please try to refresh the page and try again.",
            )
          }
          console.log("marking garden location")
          console.log("updateGardenLocation", updateGardenLocation)
          if (!updateGardenLocation) {
            drawRef?.changeMode(drawRef?.modes.DRAW_POINT)
            updateGardenLocation = true
            console.log("updateGardenLocation", updateGardenLocation)
          }
        }}
      >
        Mark Garden
      </Button>

      <MapGl
        ref={mapRef}
        initialViewState={{
          ...INITIAL_VIEW_STATE,
          longitude:
            me?.gardenLocation?.geometry.coordinates[0] ??
            INITIAL_VIEW_STATE.longitude,
          latitude:
            me?.gardenLocation?.geometry.coordinates[1] ??
            INITIAL_VIEW_STATE.latitude,
        }}
        mapStyle={mapStyle}
        mapboxAccessToken={mapboxAccessToken}
      >
        <DeckGLOverlay layers={layers} />
        <GeolocateControl
          position="top-left"
          onGeolocate={(e) => {
            console.log("geolocate", e)
          }}
        />
        <NavigationControl position="top-left" />
        <DrawControl
          position="top-left"
          displayControlsDefault
          userProperties
          controls={{
            polygon: true,
            trash: true,
            point: false,
            combine_features: false,
            uncombine_features: false,
            line_string: false,
          }}
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </MapGl>
    </Box>
  )
}

export default Map
