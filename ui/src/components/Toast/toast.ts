import { Platform, ToastAndroid } from "react-native";

interface ToastFunction {
  (message: string): string;
  error(message: string): string;
  success(message: string): string;
}

const toast: ToastFunction = (message) => {
  console.log("TOAST", message);
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.LONG);
  }
  return "";
};

toast.error = (message) => {
  console.log("TOAST/Error", message);
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.LONG);
  }
  return "";
};

toast.success = (message) => {
  console.log("TOAST/Success", message);
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.LONG);
  }
  return "";
};

export default toast;
