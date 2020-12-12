import React, { useCallback } from "react";
import { useClient } from "urql";
import { toast } from "~/lib/toast";
import {
  Story,
  useUserQuery,
  useChangeStoryQueueableMutation,
  UserDocument,
  UserQuery,
  UserQueryVariables,
} from "~/graphql/gql.gen";
import { CONFIG } from "~/lib/constants";
import { SvgUserPlus, SvgX } from "~/assets/svg";
import { useI18n } from "~/i18n/index";

const StoryQueueableAdder: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  const client = useClient();
  const [
    { fetching },
    changeStoryQueueable,
  ] = useChangeStoryQueueableMutation();
  const onUserAdd = useCallback(
    async (ev: React.FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      const username = ev.currentTarget.username.value.trim();
      if (!username) return;
      const result = await client
        .query<UserQuery, UserQueryVariables>(UserDocument, { username })
        .toPromise();
      if (!result.data?.user) return toast.error(t("user.search.notFound"));
      if (story.queueable.includes(result.data.user.id))
        return toast.open({
          type: "info",
          message: t("story.queueable.addExisted", {
            username: result.data.user.username,
          }),
        });
      const addResult = await changeStoryQueueable({
        id: story.id,
        userId: result.data.user.id,
        isRemoving: false,
      });
      if (addResult.data?.changeStoryQueueable) {
        toast.success(
          t("story.queueable.addSuccess", {
            username: result.data.user.username,
          })
        );
      }
    },
    [client, changeStoryQueueable, story, t]
  );
  return (
    <form
      autoComplete="off"
      onSubmit={onUserAdd}
      className="flex items-center rounded-full bg-background-secondary p-1"
    >
      <div className="mr-2 flex flex-center w-10 h-10 rounded-full bg-background-secondary">
        <SvgUserPlus className="w-4 h-4" />
      </div>
      <input
        name="username"
        placeholder={t("settings.username.label")}
        aria-label={t("story.queueable.title")}
        className="input h-10 w-0 p-0 border-none flex-1"
        maxLength={CONFIG.usernameMaxLength}
        required
      />
      <button
        className="btn rounded-full leading-none text-xs h-10 px-4"
        title={t("story.queueable.add")}
        disabled={fetching}
      >
        {t("story.queueable.add")}
      </button>
    </form>
  );
};

const StoryQueueableUser: React.FC<{ userId: string; storyId: string }> = ({
  userId,
  storyId,
}) => {
  const { t } = useI18n();
  const [
    { fetching },
    changeStoryQueueable,
  ] = useChangeStoryQueueableMutation();
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: userId },
  });
  const onUserRemove = useCallback(async () => {
    const result = await changeStoryQueueable({
      id: storyId,
      userId,
      isRemoving: true,
    });
    if (result.data?.changeStoryQueueable) {
      toast.success(
        t("story.queueable.removeSuccess", { username: user?.username })
      );
    }
  }, [userId, changeStoryQueueable, storyId, t, user]);
  return (
    <div className="flex items-center rounded-full bg-background-secondary p-1">
      <div className="w-10 h-10 mr-2 rounded-full overflow-hidden">
        {user ? (
          <img
            className="w-full h-full object-cover"
            src={user.profilePicture}
            alt={user.username}
          />
        ) : (
          <div className="block-skeleton w-full h-full" />
        )}
      </div>
      <div className="w-0 flex-1">
        {user ? (
          <div className="font-semibold truncate">{user.username} </div>
        ) : (
          <div className="w-20 h-5 block-skeleton" />
        )}
      </div>
      <button
        className="btn rounded-full leading-none text-xs h-10 w-10 p-0"
        title={t("story.queueable.remove", { username: user?.username })}
        disabled={fetching}
        onClick={onUserRemove}
      >
        <SvgX className="w-4 h-4" />
      </button>
    </div>
  );
};

const StoryQueueable: React.FC<{ story: Story }> = ({ story }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      <StoryQueueableAdder story={story} />
      {story.queueable.map((userId) => (
        <StoryQueueableUser key={userId} storyId={story.id} userId={userId} />
      ))}
    </div>
  );
};

export default StoryQueueable;
