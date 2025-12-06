import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlutterService} from '../services/FlutterBridge';

const STORAGE_KEY = '@user_id';

/**
 * Écran de saisie de l'UserId
 * 
 * Fonctionnalités:
 * - Saisie de l'userId
 * - Sauvegarde en AsyncStorage
 * - Envoi au module Flutter
 * - Affichage du userId actuel
 */
const UserIdInputScreen: React.FC = () => {
  const [userId, setUserId] = useState('1');
  const [savedUserId, setSavedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Charger le userId sauvegardé au démarrage
  useEffect(() => {
    loadSavedUserId();
  }, []);

  /**
   * Charge le userId depuis AsyncStorage
   */
  const loadSavedUserId = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedUserId(stored);
        setUserId(stored);
      }
    } catch (error) {
      console.error('Erreur de chargement:', error);
    }
  };

  /**
   * Sauvegarde l'userId et l'envoie à Flutter
   */
  const handleSave = async () => {
    // Validation
    if (!userId.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un User ID');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Sauvegarder dans AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, userId);
      setSavedUserId(userId);

      // 2. Envoyer au module Flutter
      await FlutterService.setUserId(userId);

      // 3. Afficher un message de succès
      Alert.alert(
        '✅ Succès',
        `User ID "${userId}" sauvegardé et envoyé au module Flutter.\n\nAllez sur l'onglet "Profil" pour voir le résultat.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        '❌ Erreur',
        `Impossible de sauvegarder: ${error}`
      );
      console.error('Erreur de sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Efface le cache Flutter
   */
  const handleClearCache = async () => {
    try {
      setIsLoading(true);
      await FlutterService.clearCache();
      Alert.alert('✅ Succès', 'Cache Flutter vidé');
    } catch (error) {
      Alert.alert('❌ Erreur', `Impossible de vider le cache: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>Configuration UserId</Text>
        <Text style={styles.subtitle}>
          Entrez un User ID pour afficher le profil
        </Text>
      </View>

      {/* Affichage du userId actuel */}
      {savedUserId && (
        <View style={styles.currentUserCard}>
          <Text style={styles.currentUserLabel}>User ID actuel:</Text>
          <Text style={styles.currentUserValue}>{savedUserId}</Text>
        </View>
      )}

      {/* Formulaire de saisie */}
      <View style={styles.form}>
        <Text style={styles.label}>User ID</Text>
        <TextInput
          style={styles.input}
          value={userId}
          onChangeText={setUserId}
          placeholder="Entrez un User ID (ex: 1, 3)"
          keyboardType="numeric"
          editable={!isLoading}
        />

        <Text style={styles.hint}>
          💡 Essayez avec les IDs: 1 ou 3
        </Text>

        {/* Bouton de sauvegarde */}
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>💾 Sauvegarder et Envoyer</Text>
          )}
        </TouchableOpacity>

        {/* Bouton vider cache */}
        <TouchableOpacity
          style={[styles.clearButton, isLoading && styles.buttonDisabled]}
          onPress={handleClearCache}
          disabled={isLoading}
        >
          <Text style={styles.clearButtonText}>🗑️ Vider le cache Flutter</Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>📋 Instructions:</Text>
        <Text style={styles.instructionsText}>
          1. Entrez un User ID{'\n'}
          2. Appuyez sur "Sauvegarder"{'\n'}
          3. Allez sur l'onglet "Profil"{'\n'}
          4. Le profil s'affiche automatiquement
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  currentUserCard: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  currentUserLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  currentUserValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196f3',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#2196f3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff5252',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButtonText: {
    color: '#ff5252',
    fontSize: 16,
    fontWeight: '600',
  },
  instructions: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e65100',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});

export default UserIdInputScreen;