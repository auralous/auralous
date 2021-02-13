import { SvgPlus, SvgUserPlus } from "assets/svg";
import { useLogin } from "components/Auth";
import { Button } from "components/Button";
import { Modal, useModal } from "components/Modal";
import { usePlayer } from "components/Player";
import { Story } from "gql/gql.gen";
import { useMe } from "hooks/user";
import { useI18n } from "i18n/index";
import dynamic from "next/dynamic";
import React from "react";
import { toast } from "utils/toast";
import StoryListeners from "./StoryListeners";
import StoryQueueable from "./StoryQueueable";

const StoryQueueAdder = dynamic(() => import("./StoryQueueAdder"), {
  ssr: false,
});

const QueueManager = dynamic(() => import("components/Queue/QueueManager"));
const QueueViewer = dynamic(() => import("components/Queue/QueueViewer"));

const StoryQueueableManager: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  const [active, open, close] = useModal();

  const me = useMe();

  return (
    <>
      <div className="px-4 py-1 flex">
        {me?.user.id === story.creatorId && (
          <>
            <Button
              color="primary"
              accessibilityLabel={t("story.queueable.title")}
              onPress={open}
              icon={<SvgUserPlus className="w-4 h-4" />}
              shape="circle"
              size="medium"
            />
            <div className="mr-1" />
            <Modal.Modal
              active={active}
              close={close}
              title={t("story.queueable.title")}
            >
              <Modal.Header>
                <Modal.Title>{t("story.queueable.title")}</Modal.Title>
              </Modal.Header>
              <Modal.Content>
                <StoryQueueable story={story} />
              </Modal.Content>
              <Modal.Footer>
                <Button title={t("common.done")} onPress={close} />
              </Modal.Footer>
            </Modal.Modal>
          </>
        )}
        <div className="flex-1">
          <StoryListeners userIds={story.queueable} />
        </div>
      </div>
    </>
  );
};

const StoryQueue: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();

  const { playQueueItem } = usePlayer();

  const me = useMe();

  const isQueueable = Boolean(
    me &&
      (story.creatorId === me.user.id || story.queueable.includes(me.user.id))
  );

  const [, showLogin] = useLogin();

  const [active, open, close] = useModal();

  const onAddButtonClick = () => {
    if (!me) return showLogin();
    if (!isQueueable)
      return toast.open({
        type: "info",
        message: t("story.queue.notAllowed"),
      });
    open();
  };

  if (story.isLive)
    return (
      <div className="h-full flex flex-col">
        <div className="absolute bottom-2 right-2">
          <Button
            accessibilityLabel={t("story.queue.adderTitle")}
            icon={<SvgPlus />}
            size="large"
            color="primary"
            onPress={onAddButtonClick}
            shape="circle"
          />
        </div>
        <StoryQueueAdder story={story} active={active} close={close} />
        <StoryQueueableManager story={story} />
        <div className="flex-1 h-0">
          <QueueManager
            isQueueable={isQueueable}
            queueId={story.id}
            onEmptyAddClick={open}
          />
        </div>
      </div>
    );

  return <QueueViewer queueId={`${story.id}:played`} onClick={playQueueItem} />;
};

export default StoryQueue;
