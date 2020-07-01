import sendbird from "./sendbird";

export interface Message {
  user: {
    nickname: string;
    user_id: string;
    profile_url: string;
  };
  message: string;
  created_at: number;
  message_i: number;
}

const getMessages = async (
  channelId: string,
  messageTimestamp: number
): Promise<Message[]> => {
  // URL for all messages in channel
  const url = `group_channels/${channelId}/messages?message_ts=${messageTimestamp}&next_limit=200&prev_limit=0`;
  200;
  const response = await sendbird(url);
  return (await response.json()).messages;
};

export const getAllMessages = async (channelId: string) => {
  let allMessages: Message[] = [];

  const fetchWithPagination = async (start: number) => {
    const messages = await getMessages(channelId, start);
    allMessages = allMessages.concat(messages);
    if (messages.length > 0) {
      start = messages[messages.length - 1].created_at + 1;
      fetchWithPagination(start);
    } else {
      return allMessages;
    }
    return allMessages;
  };

  return fetchWithPagination(0);
};
