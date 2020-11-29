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

const RoomSettingsPage: NextPage = () => {
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
  if (fetching || fetchingState) return <div />;
  if (!roomState || !room) return <div />;
  if (room.creatorId !== user?.id) return <div />;

  return (
    <>
      <NextSeo title={t("room.settings.title")} noindex />
      <div className="container relative">
        <div className="sticky z-20 top-0 left-0 w-full px-4 pt-6 pb-2 flex items-center mb-2 bg-gradient-to-b from-blue to-transparent">
          <Link href={`/room/${roomId}`}>
            <a className="btn p-1 mr-2" title={t("room.settings.backToRoom")}>
              <SvgChevronLeft className="h-8 w-8" />
            </a>
          </Link>
          <h1 className="font-bold flex-1 w-0 truncate text-4xl leading-tight">
            {t("room.settings.title")}
          </h1>
        </div>
        <section className="p-4">
          <RoomSettingsSectionTitle>
            {t("room.settings.titleInfo")}
          </RoomSettingsSectionTitle>
          <RoomSettingsBasic room={room} />
        </section>
        <section className="p-4">
          <RoomSettingsSectionTitle>
            {t("room.settings.titleRules")}
          </RoomSettingsSectionTitle>
          <RoomSettingsRules room={room} roomState={roomState} />
        </section>
        <section className="p-4">
          <RoomSettingsSectionTitle>
            {t("room.settings.titleMembers")}
          </RoomSettingsSectionTitle>
          <RoomSettingsMember room={room} roomState={roomState} />
        </section>
      </div>
    </>
  );
};

export default RoomSettingsPage;
