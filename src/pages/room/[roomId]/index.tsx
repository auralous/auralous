import React from "react";
import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";
import NotFoundPage from "../../404";
import { forwardSSRHeaders } from "~/lib/ssr-utils";
import { Room } from "~/graphql/gql.gen";
import { QUERY_ROOM } from "~/graphql/room";
import { CONFIG } from "~/lib/constants";
const RoomMain = dynamic(() => import("~/components/Room/RoomMain"), {
  ssr: false,
});

const RoomPage: NextPage<{
  room: Room | null;
}> = ({ room }) => {
  if (!room) return <NotFoundPage />;
  return (
    <>
      <NextSeo
        title={room.title}
        description={
          room.description ||
          `Join ${room.title} on Stereo and listen to music together.`
        }
        canonical={`${process.env.APP_URI}/room/${room.id}`}
        openGraph={{
          images: [
            {
              url: room.image,
              alt: room.title,
            },
          ],
        }}
        noindex={!room.isPublic}
      />
      <RoomMain initialRoom={room} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  room: Room | null;
}> = async ({ params, req, res }) => {
  const result = await fetch(
    `${process.env.API_URI}/graphql?query=${QUERY_ROOM.replace(
      /([\s,]|#[^\n\r]+)+/g,
      " "
    ).trim()}&variables=${JSON.stringify({ id: params?.roomId })}`,
    { headers: forwardSSRHeaders(req) }
  ).then((response) => response.json());
  const room = result.data?.room || null;
  if (!room) res.statusCode = 404;
  else {
    room.createdAt = JSON.stringify(room.createdAt);
    res.setHeader("cache-control", `public, max-age=${CONFIG.roomMaxAge}`);
  }
  return { props: { room } };
};

export default RoomPage;
