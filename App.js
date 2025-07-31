import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import { RefreshCw, Check } from 'lucide-react-native'; 
import { AffirmationBox } from './components/AffirmationBox'; 

export default function App() {
  const social_challenges = [
    "Order food at a busy restaurant.",
    "Ask a store employee for help finding an item.",
    "Make eye contact with 5 strangers while walking past them.",
    "Call a non-emergency business to ask a simple question (e.g., store hours).",
    "Give a genuine compliment to a service person (e.g., cashier, barista).",
    "Attend a casual social gathering for 15 minutes.",
  ];

  const uncertainty_challenges = [
    "Leave your phone at home for an hour while running an essential errand.",
    "Try a new route to a familiar destination you travel to regularly.",
    "Spend 10 minutes doing nothing but sitting quietly with your thoughts, without any distractions.",
    "Start a small task without a clear plan of how to finish it, and allow for improvisation.",
  ];

  const unfamiliar_challenges = [
    "Sit alone at a coffee shop for 30 minutes, without distractions like a phone.",
    "Walk through a crowded area (e.g., mall, downtown street) for 10 minutes.",
    "Take public transportation during a non-peak hour for at least one stop.",
    "Visit a new part of your town or city that you haven't explored before.",
    "Browse in a store you've never been to before for at least 5 minutes.",
  ];

  const sensory_challenges = [
    "Listen to a genre of music you typically avoid for 15 minutes.",
    "Eat a food with a texture you dislike (e.g., mushrooms, jello) as part of a meal.",
    "Stand in line at a grocery store during a busy time (e.g., late afternoon) for 5-10 minutes.",
    "Watch a short, mildly suspenseful TV show clip (under 5 minutes).",
  ];

  const allChallenges = [
    ...social_challenges,
    ...uncertainty_challenges,
    ...unfamiliar_challenges,
    ...sensory_challenges,
  ];

  const [currentTaskIndex, setCurrentTaskIndex] = useState(() => {
    return Math.floor(Math.random() * allChallenges.length);
  });

  const [task, setTask] = useState(allChallenges[currentTaskIndex]);

  const getRandomTask = () => {
    let newIndex;
    let count = 0;
    do {
      newIndex = Math.floor(Math.random() * allChallenges.length);
      count++;
      if (count > allChallenges.length * 2) {
        console.warn("Could not find a new unique task quickly. Returning a potentially repeated task.");
        break;
      }
    } while (newIndex === currentTaskIndex);

    setCurrentTaskIndex(newIndex);
    return allChallenges[newIndex];
  };

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const playDoneAnimation = () => {
    scaleAnim.setValue(1);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 80,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.05,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 20,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <View>
        <AffirmationBox />
      </View>

      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.taskText}>{task}</Text>
      </Animated.View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed 
          ]}
          onPress={() => {
            Haptics.selectionAsync(Haptics.ImpactFeedbackStyle.Heavy);
            setTask(getRandomTask());
          }}>
          <RefreshCw size={20} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Refresh</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed 
          ]}
          onPress={() => {
            Haptics.selectionAsync(Haptics.ImpactFeedbackStyle.Heavy);
            playDoneAnimation();
            setTask(getRandomTask());
          }}>
          <Check size={20} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Done!</Text>
        </Pressable>
      </View>

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7EDE2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 30,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  taskText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#84A59D', 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonPressed: {
    backgroundColor: '#71858C', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
