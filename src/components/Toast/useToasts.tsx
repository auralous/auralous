import { useContext } from "react";
import ToastContext from "./ToastContext";

export default function useToasts() {
  return useContext(ToastContext);
}
