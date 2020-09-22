import React, { useState, useRef, useEffect } from "react";
import { useModal } from "~/components/Modal/index";
import { CreateRoomModal } from "~/components/Room/index";
import { SvgPlus } from "~/assets/svg";

const AddNew: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Outside click close menu
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref]);

  const [activeCreateRoom, openCreateRoom, closeCreateRoom] = useModal();

  return (
    <>
      <button
        aria-label="Add new"
        type="button"
        className="button p-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <SvgPlus />
      </button>
      <div
        ref={ref}
        className={`bg-background rounded-lg overflow-hidden absolute w-48 right-4 md:right-8 lg:right-12 xl:right-20 top-12 border-background-secondary border-2 ${
          isExpanded ? "visible" : "invisible"
        }`}
      >
        <button
          onClick={openCreateRoom}
          className="block text-sm text-center font-bold w-full hover:bg-background-secondary py-4"
        >
          Create a room
        </button>
      </div>
      <CreateRoomModal active={activeCreateRoom} close={closeCreateRoom} />
    </>
  );
};

export default AddNew;
