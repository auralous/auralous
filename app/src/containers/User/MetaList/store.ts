import create, { State } from "zustand";

interface BottomSheetState extends State {
  list: "followers" | "followings" | null;
  close(): void;
  open(list: "followers" | "followings"): void;
}

const useStoreBottomSheet = create<BottomSheetState>((set) => ({
  list: null,
  close() {
    set({ list: null });
  },
  open(list) {
    set({ list });
  },
}));

export default useStoreBottomSheet;
