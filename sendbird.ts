import fetch from "node-fetch";
import * as dotenv from "dotenv";

dotenv.config();

export default async function sendbird(url: string) {
  const sendbirdApiID = process.env.SENDBIRD_API_ID;
  const sendbirdApiToken = process.env.SENDBIRD_API_TOKEN;

  if (!sendbirdApiID || !sendbirdApiToken) {
    throw new Error("Missing Sendbird config");
  }
  return fetch(`https://api-${sendbirdApiID}.sendbird.com/v3/${url}`, {
    headers: {
      "Api-Token": sendbirdApiToken,
    },
  });
}
