import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import MapGl, {
  ScaleControl,
  FullscreenControl,
  NavigationControl,
  GeolocateControl,
  MapRef,
  useControl,
  useMap,
  Layer,
} from "react-map-gl"
import {
  IconGardenCart,
  IconShovel,
  IconFlower,
  IconTree,
  IconSeeding,
  IconPlant,
} from "@tabler/icons-react"

import { INITIAL_VIEW_STATE } from "./map.config"
import { GeoJsonLayer, DeckProps } from "deck.gl"
import { MapboxOverlay } from "@deck.gl/mapbox"
import DrawControl, { drawRef } from "./drawControls"
import { useMe } from "@/hooks/useMe"
import { DrawCreateEvent, DrawUpdateEvent } from "@mapbox/mapbox-gl-draw"
import { UserSchema } from "@/types/User"
import MapStyleMenu, { mapStyles } from "./mapStyleMenu"
import MyGardenMenu, { fieldColors } from "./myGardenMenu"
import { Box, Button, Group, ActionIcon } from "@mantine/core"
import classes from "./map.module.css"
import * as turf from "@turf/turf"
import GeocoderControl from "./geocoderControl"
import { setQueryOnPage } from "@/utils/setQueryOnPage"
import { useRouter } from "next/router"
import Marker from "./marker"
import { ParsedUrlQuery } from "querystring"
import { processFeatures } from "./utils/processFeatures"
import GardenPlot from "./gardenPlot"

interface Query extends ParsedUrlQuery {
  feature?: string
  mapStyle?: string
}

const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

const DeckGLOverlay: FC<DeckProps> = (props) => {
  const overlay = useControl(() => new MapboxOverlay(props))
  overlay.setProps(props)
  return null
}

let myGardenLocationFeatureId: string | null = null

const Map: FC = () => {
  const router = useRouter()
  const query = router.query as Query

  const { me, updateMe, isPending } = useMe()
  const mapRef = useRef<MapRef>(null)

  const [myGardenSettings, setMyGardenSettings] = useState({
    visible: true,
    radius: 25,
    fieldColorIndex: 0,
    fieldColorAlpha: 100,
  })

  const processedFeatures = processFeatures(
    query.feature ? [JSON.parse(query.feature)] : [],
  )

  const layers = useMemo(
    () =>
      //[
      // new GeoJsonLayer({
      //   id: "myGarden",
      //   data: me?.gardenLocation ?? [],
      //   filled: true,
      //   pointRadiusScale: myGardenSettings.radius,
      //   getFillColor: [
      //     ...fieldColors[myGardenSettings.fieldColorIndex].fillColor,
      //     myGardenSettings.fieldColorAlpha,
      //   ],
      //   // Interactive props
      //   highlightColor: [
      //     ...fieldColors[
      //       (myGardenSettings.fieldColorIndex + 1) % fieldColors.length
      //     ].fillColor,
      //     myGardenSettings.fieldColorAlpha,
      //   ],
      //   // pickable: true,
      //   // autoHighlight: true,
      //   // onClick,
      //   beforeId: "waterway-label", // In interleaved mode render the layer under map labels
      //   visible: myGardenSettings.visible,
      //   stroked: false,
      // }),
      // new GeoJsonLayer({
      //   id: "newFeature",
      //   data: query.feature ? JSON.parse(query.feature) : [],
      //   filled: true,
      //   getFillColor: [
      //     ...fieldColors[
      //       (myGardenSettings.fieldColorIndex + 1) % fieldColors.length
      //     ].fillColor,
      //     myGardenSettings.fieldColorAlpha,
      //   ],
      //   highlightColor: [
      //     ...fieldColors[
      //       (myGardenSettings.fieldColorIndex + 2) % fieldColors.length
      //     ].fillColor,
      //     myGardenSettings.fieldColorAlpha,
      //   ],
      //   pickable: true,
      //   autoHighlight: true,
      //   // onClick,
      //   beforeId: "waterway-label", // In interleaved mode render the layer under map labels
      //   visible: true,
      //   stroked: false,
      // }),
      processedFeatures.map(({ geoJsonLayer }) => geoJsonLayer),
    // ],
    // [me?.gardenLocation, myGardenSettings, query.feature],
    [processedFeatures],
  )

  const [features, setFeatures] = useState<{ [key: string]: any }>({})

  useEffect(() => {
    console.log("me", me)
    if (me?.gardenLocation?.id) myGardenLocationFeatureId = me.gardenLocation.id
  }, [me])

  const onUpdate = useCallback(
    async (e: DrawUpdateEvent | DrawCreateEvent) => {
      console.log("[onUpdate]: ", { e })
      const feature = e.features[0]
      console.log("[feature]: ", feature)

      if (
        drawRef?.getMode() === drawRef?.modes.DRAW_POINT || // we use DRAW_POINT to mark the garden location
        feature.id === myGardenLocationFeatureId
      ) {
        const parsedUpdatedMyGardenLocation = UserSchema.safeParse({
          ...me,
          gardenLocation: {
            ...feature,
            properties: { ...feature.properties, name: "gardenLocation" },
          },
        })

        if (!parsedUpdatedMyGardenLocation.success)
          console.info(parsedUpdatedMyGardenLocation.error)
        else {
          console.log("[parsedUpdatedMyGardenLocation]: ", {
            parsedUpdatedMyGardenLocation,
          })
          const res = await updateMe(parsedUpdatedMyGardenLocation.data)
          if (res) {
            myGardenLocationFeatureId =
              parsedUpdatedMyGardenLocation.data.gardenLocation!.id

            drawRef?.delete?.(myGardenLocationFeatureId)
          }
        }
        return
      }
      try {
        // const area = turf.area(feature)

        const featureCollection = turf.featureCollection([
          ...(me?.gardenFeatures?.features ?? []),
          feature,
        ])
        console.log("featureCollection", featureCollection)
        const parsedUpdatedMyGardenFeatures = UserSchema.safeParse({
          ...me,
          gardenFeatures: featureCollection,
        })
        if (!parsedUpdatedMyGardenFeatures.success)
          console.info(parsedUpdatedMyGardenFeatures.error)
        else {
          const res = await updateMe(parsedUpdatedMyGardenFeatures.data)
          if (res) {
            drawRef?.delete?.(`${feature.id}`)
          }
        }

        // setQueryOnPage(router, { feature: JSON.stringify(feature) })
        // console.log("area", area)
      } catch (error) {
        console.info("error", error)
      }

      // setFeatures((currFeatures) => {
      //   const newFeatures = { ...currFeatures }
      //   for (const f of e.features) {
      //     newFeatures[f.id!] = f
      //   }
      //   return newFeatures
      // })
    },
    [me, updateMe],
  )
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

  const activeMapStyleIndex = query.mapStyle ? Number(query.mapStyle) : 0
  return (
    <Box className={classes.base}>
      <MapGl
        mapboxAccessToken={mapboxAccessToken}
        ref={mapRef}
        mapStyle={mapStyles[activeMapStyleIndex].url}
        initialViewState={{
          ...INITIAL_VIEW_STATE,
          longitude:
            me?.gardenLocation?.geometry.coordinates[0] ??
            INITIAL_VIEW_STATE.longitude,
          latitude:
            me?.gardenLocation?.geometry.coordinates[1] ??
            INITIAL_VIEW_STATE.latitude,
        }}
      >
        <FullscreenControl position="top-left" />
        <GeocoderControl
          mapboxAccessToken={mapboxAccessToken!}
          position={"top-left"}
        />
        <GeolocateControl position="top-left" />

        <NavigationControl position="top-left" />
        <DrawControl
          position="top-left"
          displayControlsDefault={false}
          userProperties
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
        <Group
          style={{
            marginLeft: "3rem",
            paddingTop: "0.6rem",
            gap: "0.25rem",
            flexWrap: "wrap",
          }}
        >
          <MapStyleMenu
            activeMapStyle={activeMapStyleIndex}
            onChange={(mapStyleUrl) => {
              setQueryOnPage(router, { mapStyle: mapStyleUrl })
            }}
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
            onMarkMyGarden={() => {
              if (!drawRef) {
                console.info(
                  "drawRef is null, please try to refresh the page and try again.",
                )
              }

              if (
                !!drawRef?.getMode() &&
                drawRef?.getMode() === drawRef?.modes.DRAW_POINT
              ) {
                drawRef?.changeMode(drawRef?.modes.SIMPLE_SELECT)
              } else {
                drawRef?.changeMode(drawRef?.modes.DRAW_POINT)
                const cancelDraw = ({ key }: KeyboardEvent) => {
                  if (key === "Escape") {
                    drawRef?.changeMode(drawRef?.modes.SIMPLE_SELECT)
                    if (document !== undefined) {
                      document.removeEventListener("keydown", cancelDraw)
                      document!.body.style.cursor = "pointer"
                    }
                  }
                }
                document?.addEventListener("keydown", cancelDraw)
              }
            }}
            isMarkingMyGarden={
              !!drawRef?.getMode() &&
              drawRef?.getMode() === drawRef?.modes.DRAW_POINT
            }
          />

          <Button
            ml={1}
            h={28}
            className={classes.button}
            bg="dark.2"
            onClick={() => {
              if (!drawRef) {
                console.info(
                  "drawRef is null, please try to refresh the page and try again.",
                )
              }

              drawRef?.changeMode(drawRef?.modes.DRAW_POLYGON)
            }}
          >
            Draw a Polygon
          </Button>
        </Group>
        <ScaleControl position="bottom-left" />
        {me?.gardenLocation && myGardenSettings.visible ? (
          <Marker
            latitude={me.gardenLocation.geometry.coordinates[1]}
            longitude={me.gardenLocation.geometry.coordinates[0]}
            popupContent="My Garden"
            customIcon={
              <ActionIcon loading={isPending}>
                <IconGardenCart />
              </ActionIcon>
            }
          />
        ) : null}
        {(me?.gardenFeatures?.features ?? []).map((f, i) => {
          const [{ feature, center, area }] = processFeatures([f])
          return (
            <GardenPlot
              key={i}
              feature={feature}
              position={center.geometry.coordinates}
              area_m2={area}
            />
          )
        })}
        <DeckGLOverlay layers={layers} />
      </MapGl>
    </Box>
  )
}

export default Map
