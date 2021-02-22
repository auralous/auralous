import { Typography } from "components/Typography";

const PageHeader: React.FC<{ name: string }> = ({ name }) => {
  return (
    <>
      <div className="px-4 pt-4 pb-2">
        <Typography.Title size="4xl">{name}</Typography.Title>
      </div>
    </>
  );
};

export default PageHeader;
