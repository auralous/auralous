import { SvgPlayListAdd } from "assets/svg";
import { useLogin } from "components/Auth";
import { useModal } from "components/Modal";
import { usePlayer } from "components/Player";
import { Button } from "components/Pressable";
import StoryQueueable from "components/Story/StoryQueueable";
import { Box } from "components/View";
import { Story } from "gql/gql.gen";
import { useMe } from "hooks/user";
import { useI18n } from "i18n/index";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

const StoryQueueAdder = dynamic(() => import("./StoryQueueAdder"), {
  ssr: false,
});

const QueueManager = dynamic(() => import("components/Queue/QueueManager"), {
  ssr: false,
});
const QueueViewer = dynamic(() => import("components/Queue/QueueViewer"), {
  ssr: false,
});

const StoryQueue: React.FC<{ story: Story; inactive?: boolean }> = ({
  story,
  inactive,
}) => {
  const { t } = useI18n();

  const [, { playQueueItem }] = usePlayer();

  const me = useMe();

  const isQueueable = Boolean(
    me &&
      (story.creatorId === me.user.id || story.queueable.includes(me.user.id))
  );

  const [, showLogin] = useLogin();

  const [active, open, close] = useModal();

  const onAddButtonClick = () => {
    if (!me) return showLogin();
    if (!isQueueable) return toast(t("story.queue.notAllowed"));
    open();
  };

  if (story.isLive)
    return (
      <Box fullHeight>
        <StoryQueueAdder story={story} active={active} close={close} />
        <Box row gap="xs" justifyContent="center" paddingY="xs">
          <Button
            title={t("story.queue.adderTitle")}
            icon={<SvgPlayListAdd className="w-4 h-4" />}
            size="sm"
            onPress={onAddButtonClick}
            shape="circle"
          />
          {me?.user.id === story.creatorId && <StoryQueueable story={story} />}
        </Box>
        <Box flex={1} minHeight={0}>
          <QueueManager
            isQueueable={isQueueable}
            queueId={story.id}
            inactive={inactive}
          />
        </Box>
      </Box>
    );

  return (
    <QueueViewer queueId={`${story.id}:played`} playQueueItem={playQueueItem} />
  );
};

export default StoryQueue;
