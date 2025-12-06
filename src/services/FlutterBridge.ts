import { NativeModules, NativeEventEmitter } from 'react-native';

/**
 * Service de communication avec le module Flutter
 * 
 * Utilise NativeModules pour invoquer les méthodes du MethodChannel Flutter
 */

interface FlutterModule {
  setUserId(userId: string): Promise<string>;
  getUserId(): Promise<string>;
  clearCache(): Promise<string>;
}

// Interface TypeScript pour le module natif
const FlutterBridge: FlutterModule = NativeModules.FlutterBridge || {
  setUserId: async (userId: string) => {
    console.warn('FlutterBridge not available, using mock');
    return `Mock: UserId set to ${userId}`;
  },
  getUserId: async () => {
    console.warn('FlutterBridge not available, using mock');
    return '1';
  },
  clearCache: async () => {
    console.warn('FlutterBridge not available, using mock');
    return 'Mock: Cache cleared';
  },
};

/**
 * API publique pour interagir avec Flutter
 */
export class FlutterService {
  /**
   * Envoie un nouveau userId au module Flutter
   * @param userId - ID de l'utilisateur à afficher
   */
  static async setUserId(userId: string): Promise<void> {
    try {
      const result = await FlutterBridge.setUserId(userId);
      console.log('Flutter setUserId:', result);
    } catch (error) {
      console.error('Erreur setUserId:', error);
      throw error;
    }
  }

  /**
   * Récupère l'userId actuellement affiché dans Flutter
   */
  static async getUserId(): Promise<string> {
    try {
      const userId = await FlutterBridge.getUserId();
      console.log('Flutter getUserId:', userId);
      return userId;
    } catch (error) {
      console.error('Erreur getUserId:', error);
      throw error;
    }
  }

  /**
   * Vide le cache du SDK Flutter
   */
  static async clearCache(): Promise<void> {
    try {
      const result = await FlutterBridge.clearCache();
      console.log('Flutter clearCache:', result);
    } catch (error) {
      console.error('Erreur clearCache:', error);
      throw error;
    }
  }
}

export default FlutterService;