import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Image, SafeAreaView, ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const API_BASE_URL = 'http://localhost:8000'; // Replace with your backend host if running on device/emulator

export default function App() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Media library permission is needed to pick images.');
      return;
    }

    const response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.9,
    });

    if (!response.canceled && response.assets && response.assets.length > 0) {
      const uri = response.assets[0].uri;
      setImageUri(uri);
      setResult(null);
    }
  };

  const recognize = async () => {
    if (!imageUri) return;
    try {
      setIsLoading(true);
      const form = new FormData();
      form.append('image', {
        // @ts-ignore React Native FormData file type
        uri: imageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      const res = await fetch(`${API_BASE_URL}/api/v1/recognize`, {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed: ${res.status} ${text}`);
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      Alert.alert('Error', err.message ?? String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>NutriVision</Text>
        <View style={styles.buttons}>
          <Button title="Pick image" onPress={pickImage} />
          <View style={{ width: 12 }} />
          <Button title="Recognize" onPress={recognize} disabled={!imageUri || isLoading} />
        </View>

        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
        )}

        {isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Analyzing...</Text>
          </View>
        )}

        {result && (
          <View style={styles.resultBox}>
            <Text style={styles.subtitle}>Result</Text>
            <Text>Total calories: {result.total_calories}</Text>
            {Array.isArray(result.items) && result.items.map((item: any, idx: number) => (
              <Text key={idx}>• {item.name}: {item.calories} kcal (conf {Math.round(item.confidence * 100)}%)</Text>
            ))}
          </View>
        )}
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  preview: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  loading: {
    marginVertical: 16,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
  },
  resultBox: {
    width: '100%',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
});
