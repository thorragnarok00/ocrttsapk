// App.js

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Clipboard,
  Alert,
} from "react-native";
import * as ImagePicker from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';

const App = () => {
  const [image, setImage] = useState<ImagePicker.ImagePickerResponse | null>(null);
  const [text, setText] = useState<string[] | null>(null);
  const { width: screenWidth } = Dimensions.get('window');

  useEffect(() => {
    // Comment this line to prevent auto launch of image picker on app start
    // launchImageLibrary();
  }, []);

  const launchImageLibrary = () => {
    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response && !response.didCancel) {
        setImage(response);
      }
    });
  };

  const launchCamera = () => {
    const options: ImagePicker.CameraOptions = {
      mediaType: 'photo',
    };

    ImagePicker.launchCamera(options, (response) => {
      if (response && !response.didCancel) {
        setImage(response);
      }
    });
  };

  const recognizeText = async () => {
    try {
      if (image && image.assets && image.assets.length > 0) {
        const result: string[] = await TextRecognition.recognize(image.assets[0]?.uri!) ?? [];
        console.log(result);
        setText(result);
      } else {
        setText(null);
      }
    } catch (error) {
      console.error("Error recognizing text:", error);
      setText(null);
    }
  };

  useEffect(() => {
    recognizeText();
  }, [image]);

  const getImageHeight = () => {
    if (image && image.assets && image.assets.length > 0) {
      const { width, height } = image.assets[0];
      if (width && height) {
        return (screenWidth / width) * height;
      }
    }
    return 0;
  };

  const handleCopyText = () => {
    if (text && text.length > 0) {
      const allText = text.join("\n");
      Clipboard.setString(allText);
      Alert.alert("Copied to Clipboard", "All text has been copied to the clipboard.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Text Recognition</Text>
          {image && (
            <Image
              source={{ uri: image.assets?.[0]?.uri ?? undefined }}
              style={{ width: screenWidth, height: getImageHeight() }}
            />
          )}
          <TouchableOpacity
            style={styles.recognizedTextContainer}
            onPress={handleCopyText}
          >
            {text && text.length > 0 ? (
              text.map((recognizedText, index) => (
                <Text key={index} style={styles.recognizedText}>{recognizedText}</Text>
              ))
            ) : (
              <Text style={styles.noText}>No text recognized</Text>
            )}
          </TouchableOpacity>
          <View style={styles.buttonsContainer}>
            <Button title="Select Image" onPress={launchImageLibrary} />
            <View style={styles.takePhotoButtonContainer}>
              <Button title="Take Photo" onPress={launchCamera} color="#4CAF50" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  recognizedTextContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  recognizedText: {
    fontSize: 16,
    marginBottom: 5,
  },
  noText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#555",
  },
  buttonsContainer: {
    marginTop: 20,
  },
  takePhotoButtonContainer: {
    marginTop: 10,
  },
});

export default App;
