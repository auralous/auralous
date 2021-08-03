import { Platform } from "react-native";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";

export async function checkAndRequestPermission() {
  try {
    const permission =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    const checkResult = await check(permission);
    switch (checkResult) {
      case RESULTS.BLOCKED:
        return false;
      case RESULTS.DENIED: {
        const requestResult = await request(permission);
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
