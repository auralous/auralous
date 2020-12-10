import React from "react";
import dynamic from "next/dynamic";
import { useCurrentUser } from "~/hooks/user";
import { Story } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { SvgPlus } from "~/assets/svg";
import { useLogin } from "../Auth";
import { toast } from "~/lib/toast";
import { useModal } from "~/components/Modal";

const StoryQueueAdder = dynamic(() => import("./StoryQueueAdder"), {
  ssr: false,
});

const QueueManager = dynamic(() => import("~/components/Queue/QueueManager"));
const QueueViewer = dynamic(() => import("~/components/Queue/QueueViewer"));

const StoryQueue: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();

  const user = useCurrentUser();
  const isQueueable = Boolean(
    user && (story.creatorId === user.id || story.queueable.includes(user.id))
  );

  const [, showLogin] = useLogin();

  const [active, open, close] = useModal();

  const onAddButtonClick = () => {
    if (!user) return showLogin();
    if (!isQueueable)
      return toast.open({
        type: "info",
        message: t("story.queue.notAllowed"),
      });
    open();
  };

  if (story.isLive)
    return (
      <div className="h-full relative">
        <button
          title={t("story.queue.adderTitle")}
          onClick={onAddButtonClick}
          className="z-40 btn btn-primary rounded-full absolute bottom-2 right-2 w-12 h-12 p-1"
        >
          <SvgPlus />
        </button>
        <QueueManager
          isQueueable={isQueueable}
          queueId={story.id}
          onEmptyAddClick={open}
        />
        <StoryQueueAdder story={story} active={active} close={close} />
      </div>
    );
  else
    return (
      <div className="h-full relative">
        <QueueViewer queueId={`${story.id}:played`} reverse />
      </div>
    );
};

export default StoryQueue;
