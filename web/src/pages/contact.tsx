import { ContactContainer } from "containers/Contact";
import { useI18n } from "i18n/index";
import { NextPage } from "next";
import { NextSeo } from "next-seo";

const ContactPage: NextPage = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo
        title={t("contact.title")}
        openGraph={{}}
        canonical={`${process.env.APP_URI}/contact`}
      />
      <ContactContainer />
    </>
  );
};

export default ContactPage;
