import mitt from "mitt";
import { ToastValue } from "./types";

export const emitter = mitt<{
  toast: ToastValue;
}>();
