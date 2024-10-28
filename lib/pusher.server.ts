import PusherServer from "pusher";

import { PUSHER_APP_ID, PUSHER_SECRET } from "./env.server";
import {
  NEXT_PUBLIC_PUSHER_CLUSTER,
  NEXT_PUBLIC_PUSHER_KEY,
} from "./env.client";

export const pusherServer = new PusherServer({
  appId: PUSHER_APP_ID,
  key: NEXT_PUBLIC_PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: NEXT_PUBLIC_PUSHER_CLUSTER,
});
