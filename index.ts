import { predict } from "./predict";
import { loadModel, loadMetadata } from "./loader";

const run = async (sentences: string[]) => {
  const model = await loadModel();
  const metadata = await loadMetadata();

  Promise.all(
    sentences.map((sentence) => predict(sentence, model, metadata))
  ).then((results) => {
    results.forEach((result) => {
      console.log(result.sentence, result.score, result.sentiment);
    });
  });
};

const sentences = [
  "I'm ok",
  "I'm angry",
  "I'm feeling awesome",
  "I'm fucking mad",
];

run(sentences);
