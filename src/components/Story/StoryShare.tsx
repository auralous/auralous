import React, { useCallback, useMemo, useState } from "react";
import { Modal } from "~/components/Modal";
import { toast } from "~/lib/toast";
import {
  Story,
  useSendStoryInvitesMutation,
  useUserFollowingsQuery,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { SvgFacebook, SvgTwitter, SvgReddit, SvgLink } from "~/assets/svg";
import { useCurrentUser } from "~/hooks/user";
import UserList from "../User/UserList";
import UserPill from "../User/UserPill";

const StoryShare: React.FC<{
  story: Story;
  active: boolean;
  close(): void;
}> = ({ story, active, close }) => {
  const { t } = useI18n();
  const shareUri = `${process.env.APP_URI}/story/${story.id}`;
  const name = story.text;

  const me = useCurrentUser();

  const [
    { data: { userFollowings } = { userFollowings: undefined } },
  ] = useUserFollowingsQuery({ variables: { id: me?.id || "" }, pause: !me });

  const InviteUserElement = useMemo(() => {
    const UserListInvitee: React.FC<{ id: string }> = ({ id }) => {
      const [, sendStoryInvites] = useSendStoryInvitesMutation();
      const [hasInvited, setHasInvited] = useState(false);
      const { t } = useI18n();

      const doInvite = useCallback(async () => {
        const result = await sendStoryInvites({
          id: story.id,
          invitedIds: [id],
        });
        if (!result.data?.sendStoryInvites) return;
        toast.success(t("story.invite.success"));
        setHasInvited(true);
      }, [t, id, sendStoryInvites]);

      return (
        <UserPill
          id={id}
          rightEl={
            <button
              className="btn btn-primary px-2 py-1 text-xs"
              disabled={hasInvited}
              onClick={doInvite}
            >
              {t("story.invite.title")}
            </button>
          }
        />
      );
    };
    return UserListInvitee;
  }, [story]);

  return (
    <Modal.Modal active={active} close={close} title={t("story.share.title")}>
      <Modal.Header>
        <Modal.Title>{t("story.share.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <div className="flex flex-wrap flex-center space-x-1 mb-4">
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
        </div>
        <div>
          {userFollowings ? (
            <>
              <h5 className="font-bold text-sm mb-2 text-foreground-secondary">
                {t("user.following")}
              </h5>
              <UserList Element={InviteUserElement} userIds={userFollowings} />
            </>
          ) : null}
        </div>
      </Modal.Content>
    </Modal.Modal>
  );
};

export default StoryShare;
