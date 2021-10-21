import type { LocationInput } from "@auralous/api";

export async function requestLocationPermission() {
  return true;
}

export async function getCurrentPosition() {
  if (!navigator.geolocation)
    throw new Error("Location Web API is not available");
  return new Promise<LocationInput>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lng: position.coords.longitude,
          lat: position.coords.latitude,
        });
      },
      reject,
      { enableHighAccuracy: false }
    );
  });
}
