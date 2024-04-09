import { GeoJsonLayer } from "deck.gl"
import { fieldColors } from "../myGardenMenu"
import { center, area, featureCollection } from "@turf/turf"
import { Feature } from "../drawControls"

export const processFeatures = (features: Feature[]) =>
  features.map((f, i) => ({
    feature: f,
    geoJsonLayer: new GeoJsonLayer({
      id: `layer-${f.id}`,
      data: f,
      filled: true,
      getFillColor: [
        ...fieldColors[(i + 1) % fieldColors.length].fillColor,
        100,
      ],
      highlightColor: [
        ...fieldColors[(i + 2) % fieldColors.length].fillColor,
        100,
      ],
      pickable: true,
      autoHighlight: true,
      // onClick,
      beforeId: "waterway-label", // In interleaved mode render the layer under map labels
      visible: true,
      stroked: false,
    }),
    center: center(featureCollection([f])),
    area: area(f),
  }))
