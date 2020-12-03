import { Notyf } from "notyf";

export const toast =
  typeof window !== "undefined"
    ? new Notyf({
        position: { x: "center", y: "top" },
        duration: 6000,
        dismissible: true,
        types: [
          {
            type: "info",
            background: "blue",
            icon: false,
          },
        ],
      })
    : ((null as unknown) as Notyf);
