import React from 'react';
import { requireNativeComponent, ViewStyle, Platform } from 'react-native';

/**
 * Composant natif pour afficher le module Flutter
 * 
 * iOS: Utilise FlutterViewController
 * Android: Utilise FlutterView
 */

interface FlutterViewProps {
  style?: ViewStyle;
}

// Composant natif (créé côté iOS/Android)
const NativeFlutterView = requireNativeComponent<FlutterViewProps>('FlutterView');

/**
 * Wrapper React Native pour le module Flutter
 */
const FlutterView: React.FC<FlutterViewProps> = ({ style }) => {
  return <NativeFlutterView style={style} />;
};

export default FlutterView;