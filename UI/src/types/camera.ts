export type WatermarkPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface WatermarkConfig {
  imageUrl: string
  position: WatermarkPosition
  sizePercent: number // 5 - 40% of width
  opacity: number // 0.1 - 1.0
  padding: number // in px
}

export interface GeoLocationData {
  latitude: number | null
  longitude: number | null
  accuracy: number | null // in meters
  altitude: number | null
  heading: number | null
  speed: number | null
  address: string
  timestamp: Date
  loading: boolean
  error: string | null
}

export interface GeotagDisplayConfig {
  showAddress: boolean
  showCoordinates: boolean
  showTimestamp: boolean
  showAccuracy: boolean
  position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  fontSize: 'small' | 'medium' | 'large' | 'xlarge'
}

export interface CapturedPhoto {
  id: string
  dataUrl: string
  timestamp: Date
  location: GeoLocationData
  width: number
  height: number
}
