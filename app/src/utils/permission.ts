import { Platform } from "react-native";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";

const locationPermission =
  Platform.OS === "android"
    ? PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
    : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

export async function checkAndRequestPermission() {
  try {
    const checkResult = await check(locationPermission);
    switch (checkResult) {
      case RESULTS.BLOCKED:
        return false;
      case RESULTS.DENIED: {
        const requestResult = await request(locationPermission);
        return (
          requestResult === RESULTS.GRANTED || requestResult === RESULTS.LIMITED
        );
      }
      case RESULTS.GRANTED:
        return true;
      case RESULTS.LIMITED:
        return true;
      case RESULTS.UNAVAILABLE:
        return false;
    }
  } catch (err) {
    return false;
  }
}
