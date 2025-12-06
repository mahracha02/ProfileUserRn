#  Intégration Flutter SDK dans React Native

Intégrer le SDK Flutter de profil utilisateur dans une application React Native.

---

##  Architecture

```
┌─────────────────────────────────────────────────────┐
│           APPLICATION REACT NATIVE                  │
│                                                     │
│  ┌──────────────────┐    ┌──────────────────┐       │
│  │   Tab 1: Input   │    │  Tab 2: Profile  │       │
│  │   (React Native) │    │    (Flutter)     │       │
│  │                  │    │                  │       │
│  │  TextField       │    │  FlutterView     │       │
│  │  SaveButton      │───▶│  (Native)       │       |
│  └──────────────────┘    └──────────────────┘       │
│            │                       │                │
│            ▼                       ▼                │
│    ┌────────────────────────────────────┐           │
│    │      FlutterBridge (Native)        │           │
│    │     (MethodChannel communication)  │           │
│    └────────────────────────────────────┘           │
│                      │                              │
└──────────────────────┼───────────────────────────── ┘
                       │
                       ▼
         ┌──────────────────────────┐
         │   FLUTTER SDK MODULE     │
         │                          │
         │  UserProfileScreen       │
         │  + Riverpod + API        │
         └──────────────────────────┘
```

---

##  Installation

### Prérequis

- Node.js 18+
- React Native 0.72+
- Flutter 3.19+
- Xcode 14+ (macOS)
- Android Studio (Android)

### Étape 1: Préparer le module Flutter

```bash
# Créer le module Flutter
flutter create --template module user_profile_flutter_module

# Générer le code
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
```

### Étape 2: Créer l'app React Native

```bash
# Créer le projet
npx react-native@latest init ProfileUserRn
cd ProfileUserRn

# Installer les dépendances
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
```

### Étape 3: Configuration native

#### Android

1. **Lier le module Flutter** (`android/settings.gradle`):
```gradle
setBinding(new Binding([gradle: this]))
evaluate(new File(
    settingsDir.parentFile,
    'user_profile_flutter_module/.android/include_flutter.groovy'
))
```

2. **Ajouter les modules natifs** dans `MainApplication.kt`:
```kotlin
override fun getPackages(): List<ReactPackage> =
    PackageList(this).packages.apply {
        add(FlutterBridgePackage())
    }
```

3. **Build**:
```bash
cd user_profile_flutter_module
flutter build aar
cd ../ProfileUserRn
npx react-native run-android
```

#### iOS

1. **Modifier le Podfile**:
```ruby
flutter_application_path = '../user_profile_flutter_module'
load File.join(flutter_application_path, '.ios', 'Flutter', 'podhelper.rb')

target 'ProfileUserRn' do
  # ...
  install_all_flutter_pods(flutter_application_path)
end
```

2. **Initialiser Flutter** dans `AppDelegate.mm`:
```objective-c
#import "ProfileUserRn-Swift.h"

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FlutterBridge setupFlutterEngine];
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}
```

3. **Build**:
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

---

##  Utilisation

### Flux utilisateur

1. **Onglet 1**: L'utilisateur entre un userId (1 ou 3)
2. **Sauvegarde**: L'userId est sauvegardé en AsyncStorage
3. **Envoi à Flutter**: L'userId est envoyé via MethodChannel
4. **Onglet 2**: Affiche automatiquement le profil Flutter

### Code React Native

#### Envoyer un userId

```typescript
import FlutterService from './services/FlutterBridge';

// Sauvegarder et envoyer à Flutter
await AsyncStorage.setItem('@user_id', userId);
await FlutterService.setUserId(userId);
```

#### Récupérer le userId

```typescript
const currentUserId = await FlutterService.getUserId();
console.log('UserId actuel:', currentUserId);
```

#### Vider le cache

```typescript
await FlutterService.clearCache();
```

---

##  Communication Native

### MethodChannel

Le SDK Flutter expose un `MethodChannel` pour communiquer:

```dart
// Flutter (main.dart)
static const platform = MethodChannel('com.example.userprofile/channel');

platform.setMethodCallHandler((call) async {
  switch (call.method) {
    case 'setUserId':
      final String userId = call.arguments;
      setState(() { _currentUserId = userId; });
      return 'UserId updated';
    // ...
  }
});
```

```kotlin
// Android (FlutterBridgeModule.kt)
methodChannel?.invokeMethod("setUserId", userId, object : MethodChannel.Result {
  override fun success(result: Any?) {
    promise.resolve(result.toString())
  }
  // ...
})
```

```swift
// iOS (FlutterBridge.swift)
FlutterBridge.methodChannel?.invokeMethod(
  "setUserId",
  arguments: userId
) { result in
  if let error = result as? FlutterError {
    reject(error.code, error.message, error)
  } else {
    resolve(result)
  }
}
```

---

##  Composants React Native

### Structure des fichiers

```
src/
├── screens/
│   ├── UserIdInputScreen.tsx     # Saisie userId
│   └── UserProfileScreen.tsx     # Affichage Flutter
├── components/
│   └── FlutterView.tsx           # Wrapper natif
├── services/
│   └── FlutterBridge.ts          # Communication
└── navigation/
    └── TabNavigator.tsx          # Bottom tabs
```

### Exemple d'utilisation

```tsx
// Tab Navigator
<Tab.Navigator>
  <Tab.Screen 
    name="Input" 
    component={UserIdInputScreen} 
  />
  <Tab.Screen 
    name="Profile" 
    component={UserProfileScreen} 
  />
</Tab.Navigator>

// UserIdInputScreen
const handleSave = async () => {
  await AsyncStorage.setItem('@user_id', userId);
  await FlutterService.setUserId(userId);
  Alert.alert('Succès', 'UserId mis à jour');
};

// UserProfileScreen
<FlutterView style={{ flex: 1 }} />
```

---

##  Résolution de problèmes

### Android

**Erreur: FlutterEngine not found**
```bash
cd user_profile_flutter_module
flutter build aar
cd ../UserProfileApp/android
./gradlew clean
```

**Erreur de compilation Kotlin**
- Vérifier `build.gradle`: `kotlinOptions { jvmTarget = '1.8' }`

**FlutterView ne s'affiche pas**
- Vérifier que `FlutterBridgePackage` est ajouté dans `MainApplication.kt`

### iOS

**Erreur: Flutter module not found**
```bash
cd user_profile_flutter_module
flutter build ios-framework --no-codesign
cd ../UserProfileApp/ios
pod install
```

**Bridging header error**
- Vérifier dans Xcode: Build Settings → Objective-C Bridging Header

**FlutterViewController blank**
- Vérifier que `[FlutterBridge setupFlutterEngine]` est appelé dans `AppDelegate`

### Flutter

**Erreur de génération de code**
```bash
cd user_profile_flutter_module
flutter clean
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
```

**Cache persistant**
- Utiliser `FlutterService.clearCache()` depuis React Native

---

##  Tests

### Tester la communication

```typescript
// React Native
const testBridge = async () => {
  try {
    await FlutterService.setUserId('999');
    const userId = await FlutterService.getUserId();
    console.log('✅ Bridge OK, userId:', userId);
  } catch (error) {
    console.error('❌ Bridge failed:', error);
  }
};
```

### Tester avec différents userId

```bash
# API fournie supporte userId 1 et 3
curl --location 'https://api.azeoo.dev/v1/users/me' \
--header 'X-User-Id: 1' \
--header 'Authorization: Bearer ...'
```

---

##  Performance

- **Démarrage Flutter**: ~500ms première fois, puis instantané
- **Communication MethodChannel**: < 10ms par appel
- **Cache hit**: < 10ms
- **API call**: ~500ms (selon réseau)

---

##  Sécurité

-  Token API dans le SDK Flutter (non exposé à RN)
-  Communication native sécurisée (MethodChannel)
-  Pas de données sensibles en AsyncStorage
-  HTTPS pour tous les appels API

---

##  Build Production

### Android

```bash
cd android
./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk
```

### iOS

```bash
cd ios
xcodebuild -workspace UserProfileApp.xcworkspace \
  -scheme UserProfileApp \
  -configuration Release \
  -archivePath build/UserProfileApp.xcarchive \
  archive
```

---

