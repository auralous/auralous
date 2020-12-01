import React from "react";

export const LoadingDots: React.FC = () => {
  return (
    <svg
      className="animate-spin w-10 h-10 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export const SelectingListItem: React.FC<{
  onClick: () => void;
  disabled?: boolean;
}> = ({ onClick, children, disabled }) => (
  <button
    onClick={onClick}
    className="btn rounded-none w-full justify-start font-normal mb-1 p-2 bg-transparent hover:bg-background-secondary focus:bg-background-secondary"
    disabled={disabled}
  >
    {children}
  </button>
);
