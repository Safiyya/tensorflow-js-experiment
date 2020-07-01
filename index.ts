import { predict } from "./predict";
import { loadModel, loadMetadata } from "./loader";
import { getAllMessages } from "./messages";

const run = async () => {
  const model = await loadModel();
  const metadata = await loadMetadata();

  const messages = await getAllMessages(CHANNEL_ID);
  if (!messages) return;
  Promise.all(
    messages.map((message) => predict(message.message, model, metadata))
  ).then((results) => {
    results.forEach((result, i) => {
      console.log("***************");
      console.log(result.sentence);
      console.log(`score : ${result.score}`);
      console.log(`sentiment : ${result.sentiment}`);
      console.log(`excluded words : ${result.excluded}`);
      console.log(`author:  ${messages[i].user.nickname}`);
      console.log(
        `createdAt: ${new Date(messages[i].created_at).toISOString()}`
      );
    });
  });
};

const CHANNEL_ID = process.argv[2];

run();
