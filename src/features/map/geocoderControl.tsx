import { type FC, useState } from "react"
import { useControl, ControlPosition } from "react-map-gl"
import MapboxGeocoder, { GeocoderOptions } from "@mapbox/mapbox-gl-geocoder"
import Marker, { MarkerProps } from "./marker"

interface GeocoderControlProps
  extends Omit<GeocoderOptions, "accessToken" | "mapboxgl" | "marker"> {
  mapboxAccessToken?: string
  position: ControlPosition

  onLoading?: (e: object) => void
  onResults?: (e: object) => void
  onResult?: (e: object) => void
  onError?: (e: object) => void
}

const GeocoderControl: FC<GeocoderControlProps> = ({
  mapboxAccessToken = "",
  position,
  onLoading = () => {},
  onResults = () => {},
  onResult = () => {},
  onError = (e) => {
    console.info("GeocoderControl error: ", e)
  },
  ...props
}) => {
  const [markerProps, setMarkerProps] = useState<MarkerProps | null>(null)
  const geocoder = useControl<MapboxGeocoder>(
    () => {
      const ctrl = new MapboxGeocoder({
        ...props,
        marker: !!markerProps,
        accessToken: mapboxAccessToken,
      })
      ctrl.on("loading", onLoading)
      ctrl.on("results", onResults)
      ctrl.on("result", (evt) => {
        onResult(evt)

        const { result } = evt
        const location =
          result &&
          (result.center ||
            (result.geometry?.type === "Point" && result.geometry.coordinates))

        setMarkerProps(() => {
          if (!location) return null
          return {
            longitude: location[0],
            latitude: location[1],
            popupContent: result.matching_place_name,
          }
        })
      })
      ctrl.on("error", onError)
      return ctrl
    },
    { position },
  )

  if ("_map" in geocoder) {
    if (
      geocoder.getProximity() !== props.proximity &&
      props.proximity !== undefined
    ) {
      geocoder.setProximity(props.proximity)
    }
    if (
      geocoder.getRenderFunction() !== props.render &&
      props.render !== undefined
    ) {
      geocoder.setRenderFunction(props.render)
    }
    if (
      geocoder.getLanguage() !== props.language &&
      props.language !== undefined
    ) {
      geocoder.setLanguage(props.language)
    }
    if (geocoder.getZoom() !== props.zoom && props.zoom !== undefined) {
      geocoder.setZoom(props.zoom)
    }
    if (geocoder.getFlyTo() !== props.flyTo && props.flyTo !== undefined) {
      geocoder.setFlyTo(props.flyTo)
    }
    if (
      geocoder.getPlaceholder() !== props.placeholder &&
      props.placeholder !== undefined
    ) {
      geocoder.setPlaceholder(props.placeholder)
    }
    if (
      geocoder.getCountries() !== props.countries &&
      props.countries !== undefined
    ) {
      geocoder.setCountries(props.countries)
    }
    if (geocoder.getTypes() !== props.types && props.types !== undefined) {
      geocoder.setTypes(props.types)
    }
    if (
      geocoder.getMinLength() !== props.minLength &&
      props.minLength !== undefined
    ) {
      geocoder.setMinLength(props.minLength)
    }
    if (geocoder.getLimit() !== props.limit && props.limit !== undefined) {
      geocoder.setLimit(props.limit)
    }
    if (geocoder.getFilter() !== props.filter && props.filter !== undefined) {
      geocoder.setFilter(props.filter)
    }
    if (geocoder.getOrigin() !== props.origin && props.origin !== undefined) {
      geocoder.setOrigin(props.origin)
    }
    // Types missing from @types/mapbox__mapbox-gl-geocoder
    // if (geocoder.getAutocomplete() !== props.autocomplete && props.autocomplete !== undefined) {
    //   geocoder.setAutocomplete(props.autocomplete);
    // }
    // if (geocoder.getFuzzyMatch() !== props.fuzzyMatch && props.fuzzyMatch !== undefined) {
    //   geocoder.setFuzzyMatch(props.fuzzyMatch);
    // }
    // if (geocoder.getRouting() !== props.routing && props.routing !== undefined) {
    //   geocoder.setRouting(props.routing);
    // }
    // if (geocoder.getWorldview() !== props.worldview && props.worldview !== undefined) {
    //   geocoder.setWorldview(props.worldview);
    // }
  }

  if (!markerProps) return null
  return <Marker {...markerProps} />
}
export default GeocoderControl
