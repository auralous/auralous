import React, { useState } from "react";
import { Modal } from "~/components/Modal/index";
import { useI18n } from "~/i18n/index";
import { SvgFacebook, SvgTwitter, SvgReddit, SvgMail } from "~/assets/svg";

const ShareDialog: React.FC<{
  uri: string;
  name: string;
  active: boolean;
  close: () => void;
}> = ({ uri, name, active, close }) => {
  const { t } = useI18n();
  const shareUri = uri.startsWith("/") ? `${process.env.APP_URI}${uri}` : uri;
  const [copied, setCopied] = useState(false);

  function copy() {
    const copyText = document.querySelector("#shareUri") as HTMLInputElement;
    copyText.select();
    document.execCommand("copy");
    setCopied(true);
  }

  return (
    <Modal.Modal title={t("share.title")} active={active} close={close}>
      <Modal.Header>
        <Modal.Title>{name}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <div className="flex items-center">
          <input
            id="shareUri"
            className="input w-full h-12"
            readOnly
            value={shareUri}
          />
          <button onClick={copy} className="btn m-1 h-12">
            {copied ? t("share.copied") : t("share.copy")}
          </button>
        </div>
        <div className="mt-4">
          <p className="text-foreground-tertiary text-center">
            {t("share.via")}
          </p>
          <div className="flex flex-wrap flex-center mt-4">
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
              className="btn h-12 ml-2"
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
              className="btn h-12 ml-2"
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
              className="btn h-12 ml-2"
              target="_blank"
              rel="noopener noreferrer"
              href={`mailto:?subject=${name}&body=${shareUri}`}
            >
              <SvgMail />
            </a>
          </div>
        </div>
      </Modal.Content>
    </Modal.Modal>
  );
};

export default ShareDialog;
