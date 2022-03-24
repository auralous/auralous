import type { Emitter } from "mitt";
import mitt from "mitt";
import type { ReactNode } from "react";
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export interface SettabbleRef {
  set: Set<string>;
  emitter: Emitter<any>;
}

const SettableContext = createContext({} as SettabbleRef);

export const SettableProvider = forwardRef<
  SettabbleRef,
  { children: ReactNode }
>(function SettableProvider({ children }, ref) {
  const [ctx] = useState<SettabbleRef>(() => ({
    set: new Set(),
    emitter: mitt(),
  }));

  useImperativeHandle(ref, () => ctx, [ctx]);

  return (
    <SettableContext.Provider value={ctx}>{children}</SettableContext.Provider>
  );
});

export const useSettableContext = () => useContext(SettableContext);

export const useSettableHas = (id: string) => {
  const ctx = useSettableContext();
  const [checked, setChecked] = useState(() => ctx.set.has(id));
  useEffect(() => {
    const onChange = () => setChecked(ctx.set.has(id));
    ctx.emitter.on("change", onChange);
    return () => ctx.emitter.off("change", onChange);
  }, [ctx, id]);
  return checked;
};

export const useSettableNotEmpty = () => {
  const ctx = useSettableContext();
  const [notEmpty, setNotEmpty] = useState(() => ctx.set.size > 0);
  useEffect(() => {
    const onChange = () => setNotEmpty(ctx.set.size > 0);
    ctx.emitter.on("change", onChange);
    return () => ctx.emitter.off("change", onChange);
  }, [ctx]);
  return notEmpty;
};
