import React from "react";

export const shouldRenderChildrenAsText = (children: React.ReactNode) =>
  Array.isArray(children)
    ? typeof children[0] === "string"
    : typeof children === "string";
