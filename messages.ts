import { compact, flatten } from "lodash";
import sendbird from "./sendbird";

export interface Message extends Channel {
  user: {
    nickname: string;
    user_id: string;
    profile_url: string;
  };
  message: string;
  created_at: number;
  message_i: number;
  channel_url: string;
}

export interface Channel {
  name: string;
  channel_url: string;
  joined_member_count: number;
}

const fetchMessages = async (
  channelId: string,
  messageTimestamp: number
): Promise<Message[]> => {
  // URL for all messages in channel
  const url = `group_channels/${channelId}/messages?message_ts=${messageTimestamp}&next_limit=200&prev_limit=0`;
  //   console.log(url);
  const response = await sendbird(url);
  return (await response.json()).messages;
};

export const getMessages = async (channelUrl: string) => {
  let starts: number[] = [];

  const recursion = async (start: number) => {
    starts.push(start);
    const messages = await fetchMessages(channelUrl, start);
    if (messages.length > 0) {
      start = messages[messages.length - 1].created_at + 1;
      recursion(start);
    } else {
      //   starts.push(start);
    }
    return starts;
  };
  const finalStarts = await recursion(0);

  return Promise.all(
    finalStarts.map((start) => fetchMessages(channelUrl, start))
  ).then((messages) => flatten(messages));
};

export const getGroupChannels = async (): Promise<Channel[]> => {
  const url = `group_channels?custom_type=group&order=channel_name_alphabetical`;

  const response = await sendbird(url);
  return (await response.json()).channels;
};
