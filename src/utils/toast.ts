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
            background: "rgb(18, 18, 24)",
            icon: false,
          },
          {
            type: "noti",
            className: "cursor-pointer bg-primary",
            icon: {
              text: "👋",
              tagName: "span",
              className: "text-white",
            },
          },
        ],
      })
    : ((null as unknown) as Notyf);
