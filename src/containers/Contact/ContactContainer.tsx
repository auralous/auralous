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
    <div className="py-16 container leading-loose">
      <div className="max-w-xl mx-auto">
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
      </div>
      <Box row justifyContent="center" gap="sm" paddingY={8}>
        <Button
          icon={<SvgMail />}
          title="listen@auralous.com"
          asLink="mailto:listen@auralous.com"
          shape="circle"
        />
        <Button
          icon={<SvgFacebook />}
          title="withstereo"
          asLink="/goto/facebook"
          shape="circle"
        />
        <Button
          icon={<SvgTwitter />}
          title="withstereo_"
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
    </div>
  );
};

export default ContactContainer;
