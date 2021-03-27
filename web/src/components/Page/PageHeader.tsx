import { Typography } from "components/Typography";
import { Box } from "components/View";

const PageHeader: React.FC<{ name: string }> = ({ name }) => {
  return (
    <>
      <Box padding="md">
        <Typography.Title noMargin size="4xl">
          {name}
        </Typography.Title>
      </Box>
    </>
  );
};

export default PageHeader;
