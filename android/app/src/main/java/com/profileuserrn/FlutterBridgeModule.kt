package com.profileuserrn

import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.*
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.embedding.engine.FlutterEngineCache
import io.flutter.embedding.engine.dart.DartExecutor
import io.flutter.plugin.common.MethodChannel

/**
 * Module natif Android pour communiquer avec Flutter
 * 
 * Responsabilités:
 * - Créer et gérer le FlutterEngine
 * - Exposer les méthodes au JavaScript
 * - Communiquer via MethodChannel avec Flutter
 */
class FlutterBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val ENGINE_ID = "user_profile_flutter_engine"
        const val CHANNEL_NAME = "com.example.userprofile/channel"
    }

    private var flutterEngine: FlutterEngine? = null
    private var methodChannel: MethodChannel? = null
    private val mainHandler = Handler(Looper.getMainLooper())

    override fun getName(): String = "FlutterBridge"

    /**
     * Initialise le FlutterEngine et le MethodChannel
     */
    private fun setupFlutterEngine() {
        if (flutterEngine != null) return

        mainHandler.post {
            // Créer le FlutterEngine
            flutterEngine = FlutterEngine(reactApplicationContext).apply {
                // Démarrer l'exécution Dart
                dartExecutor.executeDartEntrypoint(
                    DartExecutor.DartEntrypoint.createDefault()
                )
            }

            // Mettre en cache pour réutilisation
            FlutterEngineCache
                .getInstance()
                .put(ENGINE_ID, flutterEngine!!)

            // Créer le MethodChannel
            methodChannel = MethodChannel(
                flutterEngine!!.dartExecutor.binaryMessenger,
                CHANNEL_NAME
            )
        }
    }

    /**
     * Envoie l'userId au module Flutter
     */
    @ReactMethod
    fun setUserId(userId: String, promise: Promise) {
        setupFlutterEngine()
        
        mainHandler.post {
            methodChannel?.invokeMethod(
                "setUserId",
                userId,
                object : MethodChannel.Result {
                    override fun success(result: Any?) {
                        promise.resolve(result.toString())
                    }

                    override fun error(
                        errorCode: String,
                        errorMessage: String?,
                        errorDetails: Any?
                    ) {
                        promise.reject(errorCode, errorMessage)
                    }

                    override fun notImplemented() {
                        promise.reject("NOT_IMPLEMENTED", "Method not implemented")
                    }
                }
            )
        }
    }

    /**
     * Récupère l'userId depuis Flutter
     */
    @ReactMethod
    fun getUserId(promise: Promise) {
        setupFlutterEngine()
        
        mainHandler.post {
            methodChannel?.invokeMethod(
                "getUserId",
                null,
                object : MethodChannel.Result {
                    override fun success(result: Any?) {
                        promise.resolve(result.toString())
                    }

                    override fun error(
                        errorCode: String,
                        errorMessage: String?,
                        errorDetails: Any?
                    ) {
                        promise.reject(errorCode, errorMessage)
                    }

                    override fun notImplemented() {
                        promise.reject("NOT_IMPLEMENTED", "Method not implemented")
                    }
                }
            )
        }
    }

    /**
     * Vide le cache Flutter
     */
    @ReactMethod
    fun clearCache(promise: Promise) {
        setupFlutterEngine()
        
        mainHandler.post {
            methodChannel?.invokeMethod(
                "clearCache",
                null,
                object : MethodChannel.Result {
                    override fun success(result: Any?) {
                        promise.resolve(result.toString())
                    }

                    override fun error(
                        errorCode: String,
                        errorMessage: String?,
                        errorDetails: Any?
                    ) {
                        promise.reject(errorCode, errorMessage)
                    }

                    override fun notImplemented() {
                        promise.reject("NOT_IMPLEMENTED", "Method not implemented")
                    }
                }
            )
        }
    }
}