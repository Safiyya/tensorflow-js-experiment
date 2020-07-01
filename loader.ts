import * as tf from "@tensorflow/tfjs-node";
import fetch from "node-fetch";

// const modelUrl =
//   "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json";
// const metadataUrl =
//   "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json";

const modelUrl =
  "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_lstm_v1/model.json";
const metadataUrl =
  "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_lstm_v1/metadata.json";

export const loadModel = async (): Promise<tf.LayersModel> => {
  return tf.loadLayersModel(modelUrl);
};

export interface ModelMetadata {
  indexFrom: number;
  maxLen: number;
  wordIndex: { [key in string]: number };
  vocabularySize: number;
}

export const loadMetadata = async (): Promise<ModelMetadata> => {
  const metadataJson = await fetch(metadataUrl);
  const sentimentMetadata = await metadataJson.json();

  const indexFrom = sentimentMetadata.index_from;
  const maxLen = sentimentMetadata.max_len;
  const wordIndex = sentimentMetadata.word_index;
  const vocabularySize = sentimentMetadata.vocabulary_size;

  return { indexFrom, maxLen, wordIndex, vocabularySize };
};
