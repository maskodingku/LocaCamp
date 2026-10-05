import { useState, useEffect, useRef, useCallback } from 'react'
import type { GeoLocationData } from '../types/camera'

export function useGeolocation() {
  const [geoData, setGeoData] = useState<GeoLocationData>({
    latitude: null,
    longitude: null,
    accuracy: null,
    altitude: null,
    heading: null,
    speed: null,
    address: 'Mencari lokasi...',
    timestamp: new Date(),
    loading: true,
    error: null,
  })

  const lastCoordsRef = useRef<{ lat: number; lng: number } | null>(null)
  const isFetchingAddressRef = useRef(false)

  // Live timestamp timer (updates every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setGeoData(prev => ({
        ...prev,
        timestamp: new Date(),
      }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Reverse Geocoding helper using OpenStreetMap Nominatim (client-side)
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    // Only fetch if coordinates moved more than ~50 meters or first fetch
    if (lastCoordsRef.current) {
      const dLat = Math.abs(lastCoordsRef.current.lat - lat)
      const dLng = Math.abs(lastCoordsRef.current.lng - lng)
      if (dLat < 0.0005 && dLng < 0.0005) {
        return
      }
    }

    if (isFetchingAddressRef.current) return
    isFetchingAddressRef.current = true

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        const addr = data.address || {}
        
        // Build concise, clean address
        const parts = [
          addr.road || addr.pedestrian || addr.suburb || addr.village,
          addr.city_district || addr.district || addr.county,
          addr.city || addr.town || addr.municipality,
          addr.state || addr.province,
        ].filter(Boolean)

        const formatted = parts.length > 0 ? parts.join(', ') : (data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`)
        
        lastCoordsRef.current = { lat, lng }
        setGeoData(prev => ({
          ...prev,
          address: formatted,
        }))
      }
    } catch {
      // Fallback cleanly to coordinate display if network fails or rate limited
      setGeoData(prev => ({
        ...prev,
        address: `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`,
      }))
    } finally {
      isFetchingAddressRef.current = false
    }
  }, [])

  // Watch position
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoData(prev => ({
        ...prev,
        loading: false,
        error: 'Geolokasi tidak didukung oleh browser Anda.',
        address: 'Lokasi tidak didukung',
      }))
      return
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy, altitude, heading, speed } = position.coords

      setGeoData(prev => ({
        ...prev,
        latitude,
        longitude,
        accuracy: Math.round(accuracy),
        altitude: altitude ? Math.round(altitude) : null,
        heading: heading ? Math.round(heading) : null,
        speed: speed ? Math.round(speed * 3.6) : null, // km/h
        loading: false,
        error: null,
      }))

      reverseGeocode(latitude, longitude)
    }

    const handleError = (error: GeolocationPositionError) => {
      let errorMsg = 'Gagal mendeteksi lokasi.'
      if (error.code === error.PERMISSION_DENIED) {
        errorMsg = 'Akses lokasi ditolak. Mohon aktifkan GPS & izin lokasi browser.'
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMsg = 'Informasi lokasi tidak tersedia.'
      } else if (error.code === error.TIMEOUT) {
        errorMsg = 'Waktu permintaan lokasi habis.'
      }

      setGeoData(prev => ({
        ...prev,
        loading: false,
        error: errorMsg,
        address: errorMsg,
      }))
    }

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 15000,
    })

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [reverseGeocode])

  // Manual refresh method
  const refreshLocation = useCallback(() => {
    if (!navigator.geolocation) return
    setGeoData(prev => ({ ...prev, loading: true }))
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude, accuracy } = pos.coords
        setGeoData(prev => ({
          ...prev,
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          loading: false,
        }))
        reverseGeocode(latitude, longitude)
      },
      () => {
        setGeoData(prev => ({ ...prev, loading: false }))
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [reverseGeocode])

  return {
    ...geoData,
    refreshLocation,
  }
}
