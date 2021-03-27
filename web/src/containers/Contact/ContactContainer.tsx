import { SvgFacebook, SvgMail, SvgTwitter } from "assets/svg";
import { Button } from "components/Pressable";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { useMe } from "hooks/user";
import { useI18n } from "i18n";

const ContactContainer: React.FC = () => {
  const me = useMe();
  const { t } = useI18n();
  return (
    <Box style={{ paddingTop: "4rem", paddingBottom: "4rem" }} paddingX="md">
      <Box alignItems="center">
        <Typography.Title align="center" size="4xl">
          {t("contact.hi")}{" "}
          {me ? (
            <Typography.Text color="primary">
              {me.user.username}
            </Typography.Text>
          ) : (
            t("contact.there")
          )}
          {t("contact.how")}
        </Typography.Title>
      </Box>
      <Box row justifyContent="center" gap="sm" paddingY="xl">
        <Button
          icon={<SvgMail />}
          title="listen@auralous.com"
          asLink="mailto:listen@auralous.com"
          shape="circle"
        />
        <Button
          icon={<SvgFacebook />}
          title="auralous"
          asLink="/goto/facebook"
          shape="circle"
        />
        <Button
          icon={<SvgTwitter />}
          title="auralous_app"
          asLink="/goto/twitter"
          shape="circle"
        />
      </Box>
      <Typography.Paragraph
        size="sm"
        color="foreground-tertiary"
        align="center"
        noMargin
      >
        {t("contact.p")}
      </Typography.Paragraph>
    </Box>
  );
};

export default ContactContainer;
