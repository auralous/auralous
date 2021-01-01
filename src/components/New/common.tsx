import React from "react";

export const SelectingListItem: React.FC<{
  onClick: () => void;
  disabled?: boolean;
}> = ({ onClick, children, disabled }) => (
  <button
    onClick={onClick}
    className="btn rounded-none w-full justify-start font-normal p-2 bg-transparent hover:bg-background-tertiary focus:bg-background-tertiary"
    disabled={disabled}
  >
    {children}
  </button>
);
