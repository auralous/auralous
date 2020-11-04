import { createContext } from "react";
import { IToastContext } from "./types";

const ToastContext = createContext<IToastContext>({} as IToastContext);

export default ToastContext;
