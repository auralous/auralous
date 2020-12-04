import React, { useCallback, useMemo } from "react";
import { SvgPlus } from "~/assets/svg";
import { useModal, Modal } from "~/components/Modal";
import { toast } from "~/lib/toast";
import {
  useUserQuery,
  useUpdateStoryMembershipMutation,
  Story,
  StoryState,
  StoryMembership,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { MEMBERSHIP_NAMES } from "~/lib/constants";
import { getRole } from "~/lib/story";

const StoryMember: React.FC<{
  userId: string;
  storyId: string;
  role: StoryMembership | undefined;
}> = ({ userId, storyId, role }) => {
  const { t } = useI18n();
  const [{ data, fetching: fetchingUser }] = useUserQuery({
    variables: { id: userId },
  });
  const [
    { fetching },
    updateStoryMembership,
  ] = useUpdateStoryMembershipMutation();

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newRole = e.currentTarget.value as StoryMembership | "";
      updateStoryMembership({
        id: storyId,
        userId,
        role: newRole || null,
      }).then(({ error }) =>
        !error && newRole
          ? toast.success(
              t("story.settings.member.addedText", {
                username: data?.user?.username,
                role: MEMBERSHIP_NAMES[newRole],
              })
            )
          : toast.success(
              t("story.settings.member.removedText", {
                username: data?.user?.username,
              })
            )
      );
    },
    [t, data, storyId, updateStoryMembership, userId]
  );

  return (
    <div className="h-12 mb-2 w-full mr-1 flex shadow-lg py-2 bg-background-secondary rounded-lg">
      <div className="px-2 flex-none">
        {data?.user ? (
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={data.user.profilePicture}
            alt={data.user.username}
            title={data.user.username}
          />
        ) : (
          <div
            className={`flex-none w-8 h-8 rounded-full bg-background-secondary ${
              fetchingUser ? "animate-pulse" : ""
            }`}
          />
        )}
      </div>
      <div className="font-bold text-foreground flex items-center justify-between w-full">
        {data?.user ? (
          <div className="flex-1 w-0 leading-none truncate">
            {data.user.username}
          </div>
        ) : fetchingUser ? (
          <div className="bg-background-secondary animate-pulse rounded-lg flex-1 w-0" />
        ) : (
          <div className="flex-1 w-0 text-xs text-foreground-secondary">
            {t("story.settings.member.userNotFound")}
          </div>
        )}
        <div className="px-1 flex items-center">
          {role !== StoryMembership.Host ? (
            <>
              <select
                value={role || ""}
                onChange={onChange}
                onBlur={undefined}
                className="input px-1 py-2 mr-1"
                disabled={fetching}
              >
                <option value={StoryMembership.Collab}>
                  {MEMBERSHIP_NAMES[StoryMembership.Collab]}
                </option>
                <option value="">{MEMBERSHIP_NAMES[""]}</option>
              </select>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const StorySettingsMember: React.FC<{
  story: Story;
  storyState: StoryState;
}> = ({ story, storyState }) => {
  const { t } = useI18n();

  const [activeAdd, openAdd, closeAdd] = useModal();
  const [
    { fetching },
    updateStoryMembership,
  ] = useUpdateStoryMembershipMutation();
  const handleAdd = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (fetching) return;
    const username = ev.currentTarget.uname.value;
    if (!username) return toast.error(t("story.settings.member.userNotFound"));
    const { error } = await updateStoryMembership({
      id: story.id,
      username,
      role: StoryMembership.Collab,
    });
    if (!error) {
      toast.success(
        t("story.settings.member.addedText", {
          username: username,
          role: MEMBERSHIP_NAMES.collab,
        })
      );
      closeAdd();
    }
    return;
  };

  const otherUserIds = useMemo(
    () => storyState.collabs.filter((uid) => !storyState.userIds.includes(uid)),
    [storyState]
  );
  return (
    <>
      <div>
        <button
          className="btn btn-light h-12 mr-1 w-full mb-2"
          onClick={openAdd}
        >
          <SvgPlus /> {t("story.settings.member.title")}
        </button>
        {storyState.userIds.map((userId) => {
          return (
            <StoryMember
              key={userId}
              userId={userId}
              storyId={story.id}
              role={getRole(userId, story, storyState)}
            />
          );
        })}
        <p className="font-bold text-sm text-foreground-secondary mb-1">
          {t("story.settings.member.offline")}
        </p>
        {otherUserIds.map((userId) => {
          return (
            <StoryMember
              key={userId}
              userId={userId}
              storyId={story.id}
              role={getRole(userId, story, storyState)}
            />
          );
        })}
      </div>
      <Modal.Modal active={activeAdd} onOutsideClick={closeAdd}>
        <Modal.Header>
          <Modal.Title>{t("story.settings.member.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          <p className="mb-2">{t("story.settings.member.helpText")}</p>
          <form onSubmit={handleAdd} className="flex">
            <input
              name="uname"
              className="input flex-1 mr-1"
              aria-label={t("story.settings.member.helpText")}
            />
            <button type="submit" className="btn" disabled={fetching}>
              {t("story.settings.member.action")}
            </button>
          </form>
        </Modal.Content>
      </Modal.Modal>
    </>
  );
};

export default StorySettingsMember;
