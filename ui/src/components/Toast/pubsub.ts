import mitt from "mitt";
import type { ToastValue } from "./types";

export const emitter = mitt<{
  toast: ToastValue;
}>();
