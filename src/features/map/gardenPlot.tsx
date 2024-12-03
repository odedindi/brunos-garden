// import { Position } from "deck.gl"
import { useState, type FC, useEffect, useCallback } from "react"

import Marker from "./marker"
import { center } from "turf"
import { Feature } from "./drawControls"
import {
  AlphaSlider,
  ColorPicker,
  Divider,
  TextInput,
  Switch,
  Title,
  Stack,
  Button,
} from "@mantine/core"
import { fieldColors } from "./myGardenMenu"
import { IconGardenCart, IconMapCog, IconTrash } from "@tabler/icons-react"
import { useMe } from "@/hooks/useMe"
import { GardenFeatureSchema, User, UserSchema } from "@/types/User"
import { isEqual, update } from "lodash"

type Position = ReturnType<typeof center>["geometry"]["coordinates"]

export interface GardenPlotProps {
  feature: Feature
  position: Position
  area_m2?: number
}

const GardenPlot: FC<GardenPlotProps> = ({
  feature: initialFeature,
  position,
  area_m2,
}) => {
  const { me, updateMe, isPending } = useMe()

  const [feature, setFeature] = useState<Feature | null>(initialFeature)

  const updateFn = useCallback(
    async (data: User) => {
      const res = await updateMe(data)
      console.log("updateMe", res)
    },
    [updateMe],
  )
  useEffect(() => {
    if (!feature || !me?.gardenFeatures) return
    console.log(feature.id, { feature })

    const featureIndex = me.gardenFeatures.features.findIndex(
      ({ id }) => id === (feature.id ?? initialFeature.id),
    )
    if (featureIndex === -1) {
      console.log("Feature not found in gardenFeatures")
      return
    }
    if (!feature) {
      // remove feature
      const gardenFeatures = { ...me.gardenFeatures }
      gardenFeatures.features.splice(featureIndex, 1)
      const parsedUpdatedMyGardenFeatures = UserSchema.safeParse({
        ...me,
        gardenFeatures,
      })
      if (!parsedUpdatedMyGardenFeatures.success) {
        console.info(
          "Failed to parse updated gardenFeatures",
          parsedUpdatedMyGardenFeatures.error,
          parsedUpdatedMyGardenFeatures,
        )
        return
      }
      updateFn(parsedUpdatedMyGardenFeatures.data)
    }
    if (isEqual(feature, initialFeature)) return

    const gardenFeatures = { ...me.gardenFeatures }
    const parsedFeature = GardenFeatureSchema.safeParse(feature)
    if (!parsedFeature.success) {
      console.info("Failed to parse feature", parsedFeature.error)
      return
    }
    gardenFeatures.features[featureIndex] = parsedFeature.data
    console.log("gardenFeatures", gardenFeatures)

    const parsedUpdatedMyGardenFeatures = UserSchema.safeParse({
      ...me,
      gardenFeatures,
    })
    if (!parsedUpdatedMyGardenFeatures.success) {
      console.info(
        "Failed to parse updated gardenFeatures",
        parsedUpdatedMyGardenFeatures.error,
        parsedUpdatedMyGardenFeatures,
      )
      return
    }

    updateFn(parsedUpdatedMyGardenFeatures.data)
  }, [feature, initialFeature, me, updateFn])

  if (!feature) return null
  return (
    <Marker
      latitude={position[1]}
      longitude={position[0]}
      popupContent={
        <PlotSettings
          area_m2={area_m2}
          plotName={feature.properties?.name}
          setPlotName={(name) =>
            setFeature((prev) =>
              !prev
                ? prev
                : {
                    ...prev,
                    properties: { ...prev.properties, name },
                  },
            )
          }
          plotVisible={feature.properties?.visible}
          setPlotVisible={(visible) =>
            setFeature((prev) =>
              !prev
                ? prev
                : {
                    ...prev,
                    properties: { ...prev.properties, visible },
                  },
            )
          }
          fieldColorIndex={feature.properties?.fieldColorIndex}
          setFieldColorIndex={(fieldColorIndex) =>
            setFeature((prev) =>
              !prev
                ? prev
                : {
                    ...prev,
                    properties: { ...prev.properties, fieldColorIndex },
                  },
            )
          }
          fieldColorAlpha={feature.properties?.fieldColorAlpha}
          setFieldColorAlpha={(fieldColorAlpha) =>
            setFeature((prev) =>
              !prev
                ? prev
                : {
                    ...prev,
                    properties: { ...prev.properties, fieldColorAlpha },
                  },
            )
          }
          onDeleteFeature={() => {
            // remove feature
            if (!feature || !me?.gardenFeatures) return
            const featureIndex = me.gardenFeatures.features.findIndex(
              ({ id }) => id === (feature.id ?? initialFeature.id),
            )
            if (featureIndex === -1) {
              console.log("Feature not found in gardenFeatures")
              return
            }
            const gardenFeatures = { ...me.gardenFeatures }
            gardenFeatures.features.splice(featureIndex, 1)
            const parsedUpdatedMyGardenFeatures = UserSchema.safeParse({
              ...me,
              gardenFeatures,
            })
            if (!parsedUpdatedMyGardenFeatures.success) {
              console.info(
                "Failed to parse updated gardenFeatures",
                parsedUpdatedMyGardenFeatures.error,
                parsedUpdatedMyGardenFeatures,
              )
              return
            }
            updateFn(parsedUpdatedMyGardenFeatures.data)
          }}
        />
      }
    />
  )
}

export default GardenPlot

interface PlotSettingsProps {
  plotName?: string
  setPlotName?: (name: string) => void
  area_m2?: number
  setEditPlotPosition?: () => void
  plotVisible?: boolean
  setPlotVisible?: (visible: boolean) => void
  fieldColorIndex?: number
  setFieldColorIndex?: (fieldColorIndex: number) => void
  fieldColorAlpha?: number
  setFieldColorAlpha?: (alpha: number) => void
  onDeleteFeature?: () => void
}

const PlotSettings: FC<PlotSettingsProps> = (props) => (
  <Stack gap={"xs"}>
    <Title order={4}>Plot Settings</Title>
    <Divider />
    <TextInput
      placeholder="Plot Name"
      label="Plot Name"
      value={props.plotName}
      variant="unstyled"
      onChange={({ currentTarget: { value } }) => props.setPlotName?.(value)}
    />
    <Title order={5}>
      Plot Area: {props.area_m2 ? `${props.area_m2?.toFixed(3)} m2` : "N/A"}
    </Title>
    <Button
      disabled={!props.setEditPlotPosition}
      onClick={props.setEditPlotPosition}
      rightSection={<IconMapCog />}
    >
      Edit Plot Position
    </Button>

    <Divider />
    <Switch
      checked={props.plotVisible}
      onChange={(event) => props.setPlotVisible?.(event.currentTarget.checked)}
      label="Show Plot"
    />

    <Divider />
    <Title order={4}>Color </Title>
    <div>
      <AlphaSlider
        value={(props.fieldColorAlpha ?? 100) / 275}
        onChange={(value) => props.setFieldColorAlpha?.(value * 275)}
        color={fieldColors[props.fieldColorIndex ?? 0].rgba}
      />
      <ColorPicker
        value={fieldColors[props.fieldColorIndex ?? 0].rgba}
        onChange={(color) => {
          const colorIndex = fieldColors.findIndex(({ rgba }) => rgba === color)
          props.setFieldColorIndex?.(colorIndex === -1 ? 0 : colorIndex)
        }}
        format="rgba"
        withPicker={false}
        swatches={fieldColors.map(({ rgba }) => rgba)}
      />
    </div>

    <Divider />
    <Button
      onClick={props.onDeleteFeature}
      rightSection={<IconTrash />}
      color="red.9"
    >
      Delete Plot
    </Button>
  </Stack>
)
