import { SvgFacebook, SvgMail, SvgTwitter } from "assets/svg";
import { Button } from "components/Pressable";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { useMe } from "hooks/user";
import { useI18n } from "i18n";
import { size } from "styles";

const ContactContainer: React.FC = () => {
  const me = useMe();
  const { t } = useI18n();
  return (
    <Box style={{ paddingVertical: size(16) }} paddingX="md">
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
      <Box row justifyContent="center" gap="sm" paddingY="lg">
        <Button
          icon={<SvgMail />}
          title="listen@auralous.com"
          href="mailto:listen@auralous.com"
          shape="circle"
          size="lg"
        />
        <Button
          icon={<SvgFacebook />}
          title="withstereo"
          href="/goto/facebook"
          shape="circle"
          size="lg"
        />
        <Button
          icon={<SvgTwitter />}
          title="withstereo_"
          href="/goto/twitter"
          shape="circle"
          size="lg"
        />
      </Box>
      <Typography.Paragraph
        size="sm"
        color="foregroundTertiary"
        align="center"
        noMargin
      >
        {t("contact.p")}
      </Typography.Paragraph>
    </Box>
  );
};

export default ContactContainer;
