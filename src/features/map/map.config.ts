import {
  type MapViewState,
  AmbientLight,
  PointLight,
  LightingEffect,
} from "@deck.gl/core"

export const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
})

export const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000],
})

export const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000],
})

export const lightingEffect = new LightingEffect({
  ambientLight,
  pointLight1,
  pointLight2,
})

export const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 8.215507217344907,
  latitude: 46.87755521037303,
  zoom: 15,
  minZoom: 2,
  maxZoom: 22,
  pitch: 40.5,
  bearing: -0,
}

export const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
]
