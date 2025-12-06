import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import FlutterView from '../components/FlutterView';

/**
 * Écran d'affichage du profil utilisateur
 * 
 * Affiche le module Flutter en plein écran
 */
const UserProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <FlutterView style={styles.flutterView} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  flutterView: {
    flex: 1,
  },
});

export default UserProfileScreen;