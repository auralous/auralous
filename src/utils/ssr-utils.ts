import { GetServerSidePropsContext } from "next";

export function forwardSSRHeaders(req: GetServerSidePropsContext["req"]) {
  const userAgent = req.headers["user-agent"];
  const cookie = req.headers.cookie;
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  return {
    ...(origin && { origin }),
    ...(referer && { referer }),
    ...(userAgent && { "user-agent": userAgent }),
    ...(cookie && { cookie }),
  };
}
