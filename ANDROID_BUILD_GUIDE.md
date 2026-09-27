# 📱 Guide de Compilation Android - Sama Taxi Kaolack

Ce projet est entièrement configuré pour être compilé sous forme d'application native **Android (APK & AAB)** via le dossier `/android`.

## 📁 Structure du projet Android

```
├── android/
│   ├── app/
│   │   ├── build.gradle               # Configuration Gradle de l'application (ID: com.samataxi.kaolack)
│   │   └── src/main/
│   │       ├── AndroidManifest.xml    # Permissions (GPS, Réseau, Téléphone, etc.)
│   │       ├── assets/public/         # Build Web de Sama Taxi (dist)
│   │       ├── java/com/samataxi/kaolack/MainActivity.java
│   │       └── res/                   # Icônes de lancement, couleurs, splash
│   ├── build.gradle                   # Configuration Gradle racine
│   ├── gradlew                        # Script de build Android Gradle Wrapper
│   └── settings.gradle
├── capacitor.config.ts                # Configuration Capacitor Android
└── package.json                       # Scripts build:android
```

## 🚀 Comment compiler l'APK Android

### Méthode 1 : En ligne de commande (Gradle)
1. **Générer le build Web et synchroniser Android :**
   ```bash
   npm run build:android
   ```
2. **Compiler l'APK Debug :**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   L'APK généré se trouvera dans :  
   `android/app/build/outputs/apk/debug/app-debug.apk`

3. **Compiler l'APK Release signé :**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

### Méthode 2 : Avec Android Studio
1. Ouvrez **Android Studio**.
2. Cliquez sur **Open an existing project** et sélectionnez le dossier `android/` de ce projet.
3. Attendez la synchronisation Gradle automatique.
4. Pour tester : Branchez votre téléphone Android en mode débogage USB ou lancez un émulateur et cliquez sur **Run (▶)**.
5. Pour générer l'APK ou le Bundle Google Play : Menu **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

---
**Identifiant de l'application :** `com.samataxi.kaolack`  
**Version :** `1.0.0 (Code 1)`  
**SDK Min :** `Android 7.0 (API 24)`  
**SDK Cible :** `Android 14+ (API 34/36)`
