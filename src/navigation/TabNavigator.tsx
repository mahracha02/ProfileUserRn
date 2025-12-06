import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import UserIdInputScreen from '../screens/UserIdInputScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

const Tab = createBottomTabNavigator();

/**
 * Navigation par onglets
 * 
 * Tab 1: Saisie de l'UserId
 * Tab 2: Affichage du profil Flutter
 */
const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconText: string;

            if (route.name === 'Input') {
              iconText = '✏️';
            } else {
              iconText = '👤';
            }

            return <Text style={{ fontSize: 24 }}>{iconText}</Text>;
          },
          tabBarActiveTintColor: '#2196f3',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: '#2196f3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen
          name="Input"
          component={UserIdInputScreen}
          options={{
            tabBarLabel: 'User ID',
            headerTitle: '📝 Saisie User ID',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={UserProfileScreen}
          options={{
            tabBarLabel: 'Profil',
            headerTitle: '👤 Profil Utilisateur',
          }}
        />
      </Tab.Navigator>
    );
  };

export default TabNavigator;