/**
 * Geolocation Service for CakeChemist
 * Provides utilities for location-based features
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeolocationResult {
  success: boolean;
  coordinates?: Coordinates;
  error?: string;
}

export interface StoreLocation {
  name: string;
  address: string;
  coordinates: Coordinates;
}

export interface DeliveryZone {
  radiusKm: number;
  charge: number;
  isFree: boolean;
  minOrderForFree: number;
}

/**
 * Get the user's current location using the browser's Geolocation API
 * @returns Promise with the user's coordinates or error
 */
export const getCurrentLocation = (): Promise<GeolocationResult> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        success: false,
        error: "Geolocation is not supported by your browser"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          success: true,
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
      },
      (error) => {
        let errorMessage = "Unknown error occurred";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for geolocation";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out";
            break;
        }
        
        resolve({
          success: false,
          error: errorMessage
        });
      }
    );
  });
};

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in kilometers
 */
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(coord1.latitude)) * Math.cos(toRadians(coord2.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

/**
 * Convert degrees to radians
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Calculate delivery charge based on distance and pricing settings
 * @param distance Distance in kilometers
 * @param settings Delivery settings
 * @param subtotal Order subtotal
 * @returns Delivery charge
 */
export const calculateDeliveryCharge = (
  distance: number,
  settings: {
    baseDeliveryCharge: number;
    chargePerKm: number;
    maxDeliveryDistance: number;
    freeDeliveryThreshold: number;
  },
  subtotal: number
): { charge: number; isDeliverable: boolean } => {
  // Check if order qualifies for free delivery
  if (subtotal >= settings.freeDeliveryThreshold) {
    return { charge: 0, isDeliverable: true };
  }
  
  // Check if distance is within delivery range
  if (distance > settings.maxDeliveryDistance) {
    return { charge: 0, isDeliverable: false };
  }
  
  // Calculate charge based on distance
  const charge = settings.baseDeliveryCharge + (distance * settings.chargePerKm);
  
  return { charge: Math.round(charge), isDeliverable: true };
};

/**
 * Get the default store location
 * @returns The default store location
 */
export const getDefaultStoreLocation = (): StoreLocation => {
  // Try to get store location from localStorage
  const storedLocation = localStorage.getItem('storeLocation');
  
  if (storedLocation) {
    return JSON.parse(storedLocation);
  }
  
  // Default location (Mumbai)
  return {
    name: "CakeChemist Bakery",
    address: "123 Bakery Street, Mumbai, Maharashtra 400001",
    coordinates: {
      latitude: 19.0760,
      longitude: 72.8777
    }
  };
};

/**
 * Save store location to localStorage
 * @param location Store location to save
 */
export const saveStoreLocation = (location: StoreLocation): void => {
  localStorage.setItem('storeLocation', JSON.stringify(location));
};
