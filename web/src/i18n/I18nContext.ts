import { createContext } from "react";
import { I18NContextValue } from "./types";

const I18nContext = createContext<I18NContextValue>({} as I18NContextValue);

export default I18nContext;
