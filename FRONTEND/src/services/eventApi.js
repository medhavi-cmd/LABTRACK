import { request } from "./teamApi";

export const getNextEvent = () =>
  request("/events/next");