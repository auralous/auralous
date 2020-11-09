import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import { RoomItem } from "~/components/Room";
import { useExploreRoomsQuery, useRoomsQuery } from "~/graphql/gql.gen";
import { useCurrentUser } from "~/hooks/user";
import { SvgPlus, SvgSearch } from "~/assets/svg";
import { useI18n } from "../i18n";

const RandomRoomSection: React.FC = () => {
  const [
    { data: { exploreRooms } = { exploreRooms: undefined } },
  ] = useExploreRoomsQuery({
    variables: { by: "random" },
  });

  return (
    <div className="flex flex-wrap pb-12">
      {exploreRooms?.map((room) => (
        <div
          key={room.id}
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
        >
          <RoomItem room={room} />
        </div>
      ))}
    </div>
  );
};

const MyRoomsSection: React.FC = () => {
  const { t } = useI18n();
  const user = useCurrentUser();
  const [{ data: { rooms } = { rooms: undefined } }] = useRoomsQuery({
    variables: { creatorId: user?.id || "" },
    pause: !user,
  });
  return (
    <>
      <div>
        <div className="flex flex-wrap pb-12">
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
            <Link href="/new">
              <a className="block overflow-hidden border-2 border-background-secondary hover:border-white pb-4/3 rounded-lg relative transition ease-in-out duration-300">
                <div className="absolute-center">
                  <SvgPlus className="w-16 h-16 mx-auto rounded-full p-2 bg-foreground-secondary text-white text-opacity-75" />
                  <p className="mt-2 text-foreground-secondary text-sm text-center font-bold">
                    {t("new.titleNew")}
                  </p>
                </div>
              </a>
            </Link>
          </div>
          {rooms?.map((room) => (
            <div
              key={room.id}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
            >
              <RoomItem key={room.id} room={room} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const SearchAndPlaySection: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();
  return (
    <div className="bg-white bg-opacity-10 text-white p-4 rounded-lg mb-8">
      <h3 className="text-xl font-bold">{t("browse.playlist.title")}</h3>
      <p className="text-sm text-foreground-secondary mb-1">
        {t("browse.playlist.description")}
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const s = event.currentTarget.searchQuery.value.trim();
          s && router.push(`/new?search=${encodeURIComponent(s)}`);
        }}
        className="flex"
      >
        <input
          name="searchQuery"
          className="input w-full rounded-r-none"
          placeholder={t("new.playlist.altText")}
          aria-label={t("new.playlist.altText")}
        />
        <button
          type="submit"
          className="button rounded-l-none"
          title={t("new.playlist.searchTitle")}
        >
          <SvgSearch />
        </button>
      </form>
    </div>
  );
};

const RoomSection: React.FC = () => {
  const { t } = useI18n();
  return (
    <Tabs className="h-full flex flex-col">
      {({ selectedIndex }) => {
        const getClassName = (index: number) =>
          `font-bold mx-1 px-2 py-1 ${
            index === selectedIndex ? "opacity-100" : "opacity-25"
          } transition-opacity duration-200`;
        return (
          <>
            <TabList className="flex-none flex mb-2 justify-center">
              <Tab className={getClassName(0)}>{t("browse.titleRandom")}</Tab>
              <Tab className={getClassName(1)}>{t("browse.titleMy")}</Tab>
            </TabList>
            <TabPanels className="flex-1 overflow-hidden">
              <TabPanel>
                <RandomRoomSection />
              </TabPanel>
              <TabPanel>
                <MyRoomsSection />
              </TabPanel>
            </TabPanels>
          </>
        );
      }}
    </Tabs>
  );
};

const BrowsePage: NextPage = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo title={t("browse.title")} />
      <div className="container mx-auto">
        <div className="mb-2">
          <SearchAndPlaySection />
        </div>
        <RoomSection />
      </div>
    </>
  );
};

export default BrowsePage;
