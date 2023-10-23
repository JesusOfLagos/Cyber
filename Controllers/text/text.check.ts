import * as tf from '@tensorflow/tfjs-node';
import natural from 'natural';
import * as fs from 'fs';
import * as lodash from 'lodash';

class VulnerabilityDetector {
  private model: tf.LayersModel;

  constructor(modelPath: string) {
    this.model = tf.loadLayersModel(`file://${modelPath}`);
  }

  public static preprocessText(text: string): string[] {
    // Tokenize and preprocess the text
    const tokenizer = new natural.WordTokenizer();
    return lodash.words(text)
      .map((word) => word.toLowerCase())
      .map((word) => tokenizer.tokenize(word).join(' '));
  }

  public async predict(text: string): Promise<{ text: string; isVulnerable: boolean }> {
    const preprocessedText = VulnerabilityDetector.preprocessText(text);

    const inputTensor = tf.tensor(preprocessedText);
    const prediction = this.model.predict(inputTensor) as tf.Tensor<tf.Rank>;

    const isVulnerable = prediction.dataSync()[0] > 0.5; // Adjust this threshold as needed

    return { text, isVulnerable };
  }
}

// Example usage
(async () => {
  const modelPath = 'path/to/your/model/model.json'; // Provide the path to your saved TensorFlow.js model
  const detector = new VulnerabilityDetector(modelPath);

  const textToCheck = 'SELECT * FROM users;'; // Your text to check for vulnerabilities

  const result = await detector.predict(textToCheck);

  if (result.isVulnerable) {
    console.log('The text is vulnerable:', result.text);
  } else {
    console.log('The text is not vulnerable:', result.text);
  }
})();
