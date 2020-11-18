import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import {
  RoomSettingsMember,
  RoomSettingsBasic,
  RoomSettingsRules,
} from "~/components/Room/RoomSettings";
import { useCurrentUser } from "~/hooks/user";
import {
  useOnRoomStateUpdatedSubscription,
  useRoomQuery,
  useRoomStateQuery,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import Link from "next/link";
import { SvgChevronLeft } from "~/assets/svg";

const RoomSettingsSectionTitle: React.FC = ({ children }) => (
  <h2 className="text-2xl mb-4 p-2 pl-4 bg-background-secondary border-l-4 font-bold">
    {children}
  </h2>
);

const RoomSettingsMain: React.FC = () => {
  const { t } = useI18n();
  const user = useCurrentUser();
  const router = useRouter();
  const roomId = router.query.roomId as string | undefined;
  const [{ data: { room } = { room: undefined }, fetching }] = useRoomQuery({
    variables: { id: roomId || "" },
    pause: !roomId,
  });
  const [
    { data: { roomState } = { roomState: undefined }, fetching: fetchingState },
  ] = useRoomStateQuery({
    variables: { id: room?.id || "" },
    pause: !room,
  });
  useOnRoomStateUpdatedSubscription({
    variables: { id: room?.id || "" },
    pause: !room,
  });
  if (fetching || fetchingState) return <div>loading</div>;
  if (!roomState || !room) return <div>no</div>;
  if (room.creatorId !== user?.id) return <div>bad</div>;
  return (
    <>
      <section className="py-4">
        <RoomSettingsSectionTitle>
          {t("room.settings.titleInfo")}
        </RoomSettingsSectionTitle>
        <RoomSettingsBasic room={room} />
      </section>
      <section className="py-4">
        <RoomSettingsSectionTitle>
          {t("room.settings.titleRules")}
        </RoomSettingsSectionTitle>
        <RoomSettingsRules room={room} roomState={roomState} />
      </section>
      <section className="py-4">
        <RoomSettingsSectionTitle>
          {t("room.settings.titleMembers")}
        </RoomSettingsSectionTitle>
        <RoomSettingsMember room={room} roomState={roomState} />
      </section>
    </>
  );
};

const RoomSettingsPage: NextPage = () => {
  const { t } = useI18n();
  const router = useRouter();
  const roomId = router.query.roomId as string | undefined;

  return (
    <>
      <NextSeo title={t("room.settings.title")} noindex />
      <div className="container">
        <div className="flex items-center mb-2">
          <Link href="/room/[roomId]" as={`/room/${roomId}`}>
            <a
              className="button p-1 mr-2"
              title={t("room.settings.backToRoom")}
            >
              <SvgChevronLeft className="h-8 w-8" />
            </a>
          </Link>
          <h1 className="font-bold flex-1 w-0 truncate text-4xl leading-tight">
            {t("room.settings.title")}
          </h1>
        </div>
        <RoomSettingsMain />
      </div>
    </>
  );
};

export default RoomSettingsPage;
