import {
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";

export type MetaListState = [
  list: "followers" | "followings" | null,
  setList: (list: "followers" | "followings" | null) => void
];

export const ContextMetaList = createContext<MetaListState>(
  {} as MetaListState
);

const identityFn = (v: MetaListState) => v;

export const useListState = () =>
  useContextSelector(ContextMetaList, identityFn);
