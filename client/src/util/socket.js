import io from "socket.io-client";
import { DOMAIN } from "./service";

var socket = io(DOMAIN, {
  transports: ["websocket", "polling", "flashsocket"],
});

// socket.on("connect", () => {
// });

// socket.on("disconnect", () => {
// });

export default socket;
