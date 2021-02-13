import { SvgFacebook, SvgLink, SvgReddit, SvgTwitter } from "assets/svg";
import { Button } from "components/Button";
import { Modal } from "components/Modal";
import UserList from "components/User/UserList";
import UserPill from "components/User/UserPill";
import {
  Story,
  useSendStoryInvitesMutation,
  useUserFollowingsQuery,
} from "gql/gql.gen";
import { useMe } from "hooks/user";
import { useI18n } from "i18n/index";
import React, { useCallback, useMemo, useState } from "react";
import { toast } from "utils/toast";

const StoryShare: React.FC<{
  story: Story;
  active: boolean;
  close(): void;
}> = ({ story, active, close }) => {
  const { t } = useI18n();
  const shareUri = `${process.env.APP_URI}/story/${story.id}`;
  const name = story.text;

  const me = useMe();

  const [
    { data: { userFollowings } = { userFollowings: undefined } },
  ] = useUserFollowingsQuery({
    variables: { id: me?.user.id || "" },
    pause: !me,
  });

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
            <Button
              color="primary"
              size="small"
              disabled={hasInvited}
              onPress={doInvite}
              title={t("story.invite.title")}
            />
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
          <Button
            onPress={() =>
              navigator.clipboard
                .writeText(shareUri)
                .then(() => toast.success(t("share.copied")))
            }
            icon={<SvgLink />}
            accessibilityLabel={t("share.copy")}
          />
          <Button
            asLink={`https://www.facebook.com/dialog/share?app_id=${process.env.FACEBOOK_APP_ID}&href=${shareUri}&display=popup`}
            icon={<SvgFacebook className="fill-current stroke-0" />}
            accessibilityLabel="Facebook"
          />
          <Button
            asLink={`https://twitter.com/intent/tweet?url=${shareUri}&text=${encodeURIComponent(
              name
            )}`}
            icon={<SvgTwitter className="fill-current stroke-0" />}
            accessibilityLabel="Twitter"
          />
          <Button
            asLink={`https://reddit.com/submit?url=${shareUri}&title=${encodeURIComponent(
              name
            )}`}
            icon={<SvgReddit width="24" className="fill-current stroke-0" />}
            accessibilityLabel="Reddit"
          />
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
