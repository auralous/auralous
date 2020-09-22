import { createContext } from "react";
import { IToastContext } from "./types";

const ToastContext = createContext<IToastContext>({} as any);

export default ToastContext;
