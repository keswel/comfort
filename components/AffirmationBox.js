import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const allAfirmations = [
  "This is a step forward, no matter how small. You're doing great!",
  "Progress, not perfection. Every effort counts.",
  "You're building strength, one step at a time. Keep going!",
  "Be kind to yourself. This challenge is an opportunity to grow.",
  "Embrace the discomfort; it's a sign of growth.",
  "You are courageous for taking this on. Believe in your progress.",
  "Feel the fear and do it anyway. You've got this!",
  "This challenge is helping you get stronger. You're making real progress.",
  "Even a small step today is a huge victory for tomorrow. Celebrate it!",
  "Trust the process. Each challenge brings you closer to your goals."
];

export const AffirmationBox = () => { 
  const [currentAffirmation, setCurrentAffirmation] = useState('');

  // function to get a random affirmation
  const getRandomAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * allAfirmations.length);
    return allAfirmations[randomIndex];
  };

  useEffect(() => {
    setCurrentAffirmation(getRandomAffirmation());
  }, []); 

  return (
    <View style={styles.affirmationContainer}>
      <Text style={styles.affirmationText}>
        {currentAffirmation}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  affirmationContainer: {
    backgroundColor: '#D9EDF7', 
    padding: 15,
    borderRadius: 8,
    marginBottom: 25, 
    width: '90%', 
    alignSelf: 'center', 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  affirmationText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#00566C', 
    fontStyle: 'italic',
    lineHeight: 22,
  },
});
