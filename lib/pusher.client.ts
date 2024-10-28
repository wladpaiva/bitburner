import PusherClient from "pusher-js";

import {
  NEXT_PUBLIC_PUSHER_KEY,
  NEXT_PUBLIC_PUSHER_CLUSTER,
} from "./env.client";

export const pusherClient = new PusherClient(NEXT_PUBLIC_PUSHER_KEY, {
  cluster: NEXT_PUBLIC_PUSHER_CLUSTER,
});
