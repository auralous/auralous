import React from "react";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import { Chatbox } from "~/components/Chat/index";
import {
  Room,
  RoomMembership,
  RoomState,
  useUserQuery,
} from "~/graphql/gql.gen";
import { useCurrentUser } from "~/hooks/user";
import { MEMBERSHIP_NAMES } from "~/lib/constants";
import { AuthBanner } from "~/components/Auth";
import { getRole } from "~/lib/room";
import { useI18n } from "~/i18n/index";
import { SvgUserGroup } from "~/assets/svg";

const CurrentUser: React.FC<{
  userId: string;
  role: RoomMembership | undefined;
}> = ({ userId, role }) => {
  const [{ data }] = useUserQuery({ variables: { id: userId } });
  return (
    <div className="h-12 mb-2 w-full mr-1 flex py-2 bg-background-secondary rounded-lg">
      {
        //FIXME: Add user name
        data?.user ? (
          <>
            <div className="px-2 flex-none">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={data.user.profilePicture}
                alt={data.user.username}
                title={data.user.username}
              />
            </div>
            <div className="font-bold text-foreground flex items-center justify-between w-full">
              <div className="flex-1 w-0 leading-none truncate">
                {data.user.username}
              </div>
              <div className="px-2 flex items-center">
                <span className="py-1 px-2 text-xs rounded-full bg-background-secondary">
                  {MEMBERSHIP_NAMES[role || ""]}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mx-2 flex-none w-8 h-8 rounded-full bg-background-secondary animate-pulse" />
            <div className="bg-background-secondary animate-pulse rounded-lg w-full mr-2" />
          </>
        )
      }
    </div>
  );
};

const RoomUsers: React.FC<{ roomState: RoomState | undefined; room: Room }> = ({
  room,
  roomState,
}) => {
  return (
    <div className="h-full p-2">
      {roomState?.userIds.map((userId) => (
        // TODO: react-window
        <CurrentUser
          key={userId}
          userId={userId}
          role={getRole(userId, room, roomState)}
        />
      ))}
    </div>
  );
};

const RoomChat: React.FC<{ room: Room; roomState?: RoomState }> = ({
  room,
  roomState,
}) => {
  const { t } = useI18n();
  const user = useCurrentUser();
  if (!user)
    return (
      <div className="h-full w-full flex flex-col justify-center">
        <AuthBanner
          prompt={t("room.chat.authPrompt")}
          hook={t("room.chat.authPromptHook")}
        />
      </div>
    );
  return (
    <Tabs className="h-full flex flex-col">
      {({ selectedIndex }) => {
        const getClassName = (index: number) =>
          `flex flex-center flex-1 mx-1 p-1 text-sm rounded-lg font-bold ${
            index === selectedIndex
              ? "bg-foreground bg-opacity-25 text-white"
              : "opacity-75"
          } transition duration-200`;
        return (
          <>
            <TabList className="flex flex-none">
              <Tab className={getClassName(0)}>{t("room.chat.title")}</Tab>
              <Tab className={`${getClassName(1)} flex-none px-2`}>
                <SvgUserGroup width="12" height="12" />
                <span className="ml-1">
                  {roomState?.userIds.length || 0}
                  <span className="sr-only">{t("room.chat.listener")}</span>
                </span>
              </Tab>
            </TabList>
            <TabPanels className="flex-1">
              <TabPanel className="h-full">
                <Chatbox roomId={room.id} />
              </TabPanel>
              <TabPanel className="h-full">
                <RoomUsers room={room} roomState={roomState} />
              </TabPanel>
            </TabPanels>
          </>
        );
      }}
    </Tabs>
  );
};

export default RoomChat;
