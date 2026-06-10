import * as Location from 'expo-location';

export interface ActivityLocation {
  latitude: number;
  longitude: number;
  formatted: string;
}

/**
 * Convert decimal degrees to DMS (Degrees, Minutes, Seconds) format
 * Example: -6.2088, 106.8456 → "6°12'31.7"S 106°50'44.3"E"
 */
export function formatCoordinates(latitude: number, longitude: number): string {
  const formatCoord = (decimal: number, pos: string, neg: string): string => {
    const absolute = Math.abs(decimal);
    const degrees = Math.floor(absolute);
    const minutesDecimal = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = ((minutesDecimal - minutes) * 60).toFixed(1);
    const direction = decimal >= 0 ? pos : neg;
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  const lat = formatCoord(latitude, 'N', 'S');
  const lng = formatCoord(longitude, 'E', 'W');

  return `${lat} ${lng}`;
}

/**
 * Request location permission
 */
export async function requestLocationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Location.requestForegroundPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/**
 * Capture current location
 * Returns null if permission denied or location unavailable
 */
export async function captureLocation(): Promise<ActivityLocation | null> {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return null;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = location.coords;

    return {
      latitude,
      longitude,
      formatted: formatCoordinates(latitude, longitude),
    };
  } catch (error) {
    console.warn('Failed to capture location:', error);
    return null;
  }
}
