import React, { useCallback, useState } from "react";
import ModeSelector from "./ModeSelector";
import SelectSongs from "./SelectSongs";

const Container: React.FC = () => {
  const [mode, setMode] = useState<null | "select" | "quick">(null);
  const onFinish = useCallback((selectedTracks: string[]) => {
    return;
  }, []);
  return (
    <>
      {mode === "select" ? (
        <SelectSongs onFinish={onFinish} />
      ) : mode === "quick" ? null : (
        <ModeSelector setMode={setMode} />
      )}
    </>
  );
};

export default Container;
