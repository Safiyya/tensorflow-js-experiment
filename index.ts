import { predict } from "./predict";
import { loadModel, loadMetadata } from "./loader";
import { getGroupChannelsMessages, Message } from "./messages";
import { createObjectCsvWriter } from "csv-writer";
import moment from "moment";
import { compact } from "lodash";

export interface Result {
  date: string;
  author: string;
  sentence: string;
  score: number;
  excluded_words: string[];
}

const run = async () => {
  const model = await loadModel();
  const metadata = await loadMetadata();

  const messages = await getGroupChannelsMessages();
  if (!messages) return;

  const writer = createObjectCsvWriter({
    path: "./results.csv",
    header: [
      { id: "createdAt", title: "Created at" },
      { id: "author", title: "Author" },
      { id: "sentence", title: "Sentence" },
      { id: "score", title: "Score" },
      { id: "excluded_words", title: "Exculded words" },
    ],
  });

  const results = await Promise.all(
    compact(messages).map((message) => {
      return predict(message.message, model, metadata);
    })
  );

  console.log(results);

  const records = results.map((result, i) => ({
    createdAt: moment(messages[i].created_at).toISOString(),
    author: messages[i].user.nickname,
    sentence: result.sentence,
    score: result.score,
    excluded_words: result.excluded,
  }));
  await writer.writeRecords(records);
};

run();
