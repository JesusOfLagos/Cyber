import * as tf from '@tensorflow/tfjs-node';
import axios from 'axios';
import * as fs from 'fs';

class ImageVulnerabilityDetector {
  private model: tf.GraphModel;

  constructor(modelPath: string) {
    this.loadModel(modelPath);
  }

  private async loadModel(modelPath: string): Promise<void> {
    this.model = await tf.loadGraphModel(`file://${modelPath}`);
  }

  public async predict(imageUrl: string): Promise<{ imageUrl: string; isVulnerable: boolean }> {
    const imageBuffer = await this.downloadImage(imageUrl);

    if (!imageBuffer) {
      throw new Error('Failed to download the image.');
    }

    const imageTensor = this.preprocessImage(imageBuffer);
    const prediction = this.model.predict(imageTensor) as tf.Tensor<tf.Rank>;

    const isVulnerable = prediction.dataSync()[0] > 0.5; // Adjust this threshold as needed

    return { imageUrl, isVulnerable };
  }

  private async downloadImage(imageUrl: string): Promise<Buffer | null> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data, 'binary');
    } catch (error) {
      console.error('Error downloading the image:', error);
      return null;
    }
  }

  private preprocessImage(imageBuffer: Buffer): tf.Tensor<tf.Rank> {
    const image = tf.node.decodeImage(imageBuffer);
    const resizedImage = tf.image.resizeBilinear(image, [224, 224]);
    const expandedImage = resizedImage.expandDims(0);
    const preprocessedImage = expandedImage.toFloat().div(127).sub(1);
    return preprocessedImage;
  }
}

// Example usage
(async () => {
  const modelPath = 'path/to/your/model/model.json'; // Provide the path to your saved TensorFlow.js model
  const detector = new ImageVulnerabilityDetector(modelPath);

  const imageUrl = 'https://example.com/your-image.jpg'; // URL of the image to check for vulnerabilities

  const result = await detector.predict(imageUrl);

  if (result.isVulnerable) {
    console.log('The image is vulnerable:', result.imageUrl);
  } else {
    console.log('The image is not vulnerable:', result.imageUrl);
  }
})();
