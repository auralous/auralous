import { SvgUserPlus, SvgX } from "assets/svg";
import { Button } from "components/Pressable";
import {
  Story,
  useChangeStoryQueueableMutation,
  UserDocument,
  UserQuery,
  UserQueryVariables,
  useStoryUpdatedSubscription,
  useUserQuery,
} from "gql/gql.gen";
import { useI18n } from "i18n/index";
import React, { useCallback } from "react";
import { useClient } from "urql";
import { CONFIG } from "utils/constants";
import { toast } from "utils/toast";

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
      <Button
        shape="circle"
        title={t("story.queueable.add")}
        disabled={fetching}
      />
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
      <Button
        accessibilityLabel={t("story.queueable.remove", {
          username: user?.username,
        })}
        disabled={fetching}
        onPress={onUserRemove}
        icon={<SvgX className="w-4 h-4" />}
        shape="circle"
      />
    </div>
  );
};

const StoryQueueable: React.FC<{ story: Story }> = ({ story }) => {
  useStoryUpdatedSubscription(
    { variables: { id: story.id } },
    (prev, data) => data
  );
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
