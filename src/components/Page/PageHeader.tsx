import { Typography } from "components/Typography";
import React from "react";

const PageHeader: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div className="p-4 pt-6">
      <Typography.Title size="4xl">{name}</Typography.Title>
    </div>
  );
};

export default PageHeader;
