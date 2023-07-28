import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Buffer } from "buffer";
import { ocr } from "../services/client"

const ImageTextReader = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [recognizedText, setRecognizedText] = useState('');
  const webcamRef = useRef<any>(null); // Use any type for temporary fix

  const handleCameraCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageUri(imageSrc);
    processImage(imageSrc);
  };

  const processImage = async (imageSrc: any) => {

    // Send the imageSrc to the server for text recognition using tesseract.js or other OCR libraries
    // In this example, we'll just set some dummy text after a short delay.
    try {
      // Replace this with actual server-side processing using tesseract.js or other OCR libraries
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setRecognizedText(await ocr(imageSrc));
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  const handleImagePicker = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUri(reader.result?.toString() ?? null);
      processImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{ width: 640, height: 480 }}
      />
      <button onClick={handleCameraCapture}>Capture</button>
      <input type="file" accept="image/*" onChange={handleImagePicker} />
      {imageUri && <img src={imageUri} alt="Captured" style={{ width: 200, height: 200 }} />}
      {recognizedText && (
        <div style={{ padding: 20 }}>
          <p>{recognizedText}</p>
        </div>
      )}
    </div>
  );
};

export default ImageTextReader;