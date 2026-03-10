import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { RefreshCw, Check, Flame } from 'lucide-react-native';
import { AffirmationBox } from './components/AffirmationBox';

const CHALLENGES = [
  { text: "Order food at a busy restaurant.", category: "Social" },
  { text: "Ask a store employee for help finding an item.", category: "Social" },
  { text: "Make eye contact with 5 strangers while walking past them.", category: "Social" },
  { text: "Call a non-emergency business to ask a simple question (e.g., store hours).", category: "Social" },
  { text: "Give a genuine compliment to a service person (e.g., cashier, barista).", category: "Social" },
  { text: "Attend a casual social gathering for 15 minutes.", category: "Social" },
  { text: "Leave your phone at home for an hour while running an essential errand.", category: "Uncertainty" },
  { text: "Try a new route to a familiar destination you travel to regularly.", category: "Uncertainty" },
  { text: "Spend 10 minutes sitting quietly with your thoughts, without any distractions.", category: "Uncertainty" },
  { text: "Start a small task without a clear plan of how to finish it, and allow for improvisation.", category: "Uncertainty" },
  { text: "Sit alone at a coffee shop for 30 minutes, without distractions like a phone.", category: "Unfamiliar" },
  { text: "Walk through a crowded area (e.g., mall, downtown street) for 10 minutes.", category: "Unfamiliar" },
  { text: "Take public transportation during a non-peak hour for at least one stop.", category: "Unfamiliar" },
  { text: "Visit a new part of your town or city that you haven't explored before.", category: "Unfamiliar" },
  { text: "Browse in a store you've never been to before for at least 5 minutes.", category: "Unfamiliar" },
  { text: "Listen to a genre of music you typically avoid for 15 minutes.", category: "Sensory" },
  { text: "Eat a food with a texture you dislike (e.g., mushrooms, jello) as part of a meal.", category: "Sensory" },
  { text: "Stand in line at a grocery store during a busy time for 5–10 minutes.", category: "Sensory" },
  { text: "Watch a short, mildly suspenseful TV show clip (under 5 minutes).", category: "Sensory" },
];

const CATEGORY_COLORS = {
  Social:      '#84A59D',
  Uncertainty: '#C9A87C',
  Unfamiliar:  '#A084CA',
  Sensory:     '#CA8484',
};

function pickNewIndex(lastIndex) {
  const candidates = CHALLENGES
    .map((_, i) => i)
    .filter(i => i !== lastIndex);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export default function App() {
  const lastIndexRef = useRef(-1);
  const [currentIndex, setCurrentIndex] = useState(() => pickNewIndex(-1));
  const [streak, setStreak] = useState(0);

  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const streakAnim = useRef(new Animated.Value(1)).current;

  const challenge = CHALLENGES[currentIndex];
  const categoryColor = CATEGORY_COLORS[challenge.category];

  // keep lastIndexRef in sync
  useEffect(() => { lastIndexRef.current = currentIndex; }, [currentIndex]);

  const transitionCard = (onMidpoint) => {
    fadeAnim.setValue(1);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onMidpoint();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  };

  const bounceCard = () => {
    scaleAnim.setValue(1);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 80,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.04,
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

  const popStreak = () => {
    streakAnim.setValue(1);
    Animated.sequence([
      Animated.spring(streakAnim, {
        toValue: 1.4,
        friction: 3,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.spring(streakAnim, {
        toValue: 1,
        friction: 4,
        tension: 20,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRefresh = () => {
    Haptics.selectionAsync();
    transitionCard(() => setCurrentIndex(pickNewIndex(lastIndexRef.current)));
  };

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    bounceCard();
    popStreak();
    setStreak(s => s + 1);
    transitionCard(() => setCurrentIndex(pickNewIndex(lastIndexRef.current)));
  };

  return (
    <View style={styles.container}>
      <AffirmationBox />

      {/* Streak badge */}
      <Animated.View
        style={[styles.streakBadge, { transform: [{ scale: streakAnim }] }]}
      >
        <Flame size={16} color="#f97316" />
        <Text style={styles.streakText}>{streak} done</Text>
      </Animated.View>

      {/* Challenge card */}
      <Animated.View
        style={[
          styles.card,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={[styles.categoryPill, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryText}>{challenge.category}</Text>
        </View>
        <Text style={styles.taskText}>{challenge.text}</Text>
      </Animated.View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [styles.buttonOutline, pressed && styles.buttonOutlinePressed]}
          onPress={handleRefresh}
        >
          <RefreshCw size={18} color="#84A59D" style={{ marginRight: 6 }} />
          <Text style={styles.buttonOutlineText}>Skip</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.buttonFilled, pressed && styles.buttonFilledPressed]}
          onPress={handleDone}
        >
          <Check size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.buttonFilledText}>Done!</Text>
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
    gap: 20,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f97316',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryPill: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  taskText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
    color: '#2d2d2d',
    lineHeight: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  // Outlined "Skip" button
  buttonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#84A59D',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 25,
  },
  buttonOutlinePressed: {
    backgroundColor: '#84A59D22',
  },
  buttonOutlineText: {
    color: '#84A59D',
    fontSize: 17,
    fontWeight: '700',
  },
  // Filled "Done!" button
  buttonFilled: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#84A59D',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 25,
    shadowColor: '#84A59D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonFilledPressed: {
    backgroundColor: '#71858C',
    shadowOpacity: 0.15,
  },
  buttonFilledText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
