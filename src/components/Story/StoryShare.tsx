import React from "react";
import { Modal } from "~/components/Modal";
import { toast } from "~/lib/toast";
import { Story } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import {
  SvgFacebook,
  SvgTwitter,
  SvgReddit,
  SvgMail,
  SvgLink,
} from "~/assets/svg";

const StoryShare: React.FC<{
  story: Story;
  active: boolean;
  close(): void;
}> = ({ story, active, close }) => {
  const { t } = useI18n();
  const shareUri = `${process.env.APP_URI}/story/${story.id}`;
  const name = story.text;
  return (
    <Modal.Modal active={active} close={close} title={t("story.share.title")}>
      <Modal.Header>
        <Modal.Title>{t("story.share.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <div className="flex flex-wrap flex-center space-x-1 space-y-1">
          <button
            onClick={() =>
              navigator.clipboard
                .writeText(shareUri)
                .then(() => toast.success(t("share.copied")))
            }
            className="btn h-12"
            title={t("share.copy")}
          >
            <SvgLink />
          </button>
          <a
            title="Facebook"
            className="btn h-12"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.facebook.com/dialog/share?app_id=${process.env.FACEBOOK_APP_ID}&href=${shareUri}&display=popup`}
          >
            <SvgFacebook className="fill-current stroke-0" />
          </a>
          <a
            title="Twitter"
            className="btn h-12"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://twitter.com/intent/tweet?url=${shareUri}&text=${encodeURIComponent(
              name
            )}`}
          >
            <SvgTwitter className="fill-current stroke-0" />
          </a>
          <a
            title="Reddit"
            className="btn h-12"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://reddit.com/submit?url=${shareUri}&title=${encodeURIComponent(
              name
            )}`}
          >
            <SvgReddit width="24" className="fill-current stroke-0" />
          </a>
          <a
            title="Email"
            className="btn h-12"
            target="_blank"
            rel="noopener noreferrer"
            href={`mailto:?subject=${name}&body=${shareUri}`}
          >
            <SvgMail />
          </a>
        </div>
      </Modal.Content>
    </Modal.Modal>
  );
};

export default StoryShare;
