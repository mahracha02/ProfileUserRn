package com.profileuserrn

import android.view.View
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import io.flutter.embedding.android.FlutterView
import io.flutter.embedding.engine.FlutterEngineCache

/**
 * ViewManager pour afficher le module Flutter dans React Native
 */
class FlutterViewManager : SimpleViewManager<FlutterView>() {

    override fun getName(): String = "FlutterView"

    override fun createViewInstance(reactContext: ThemedReactContext): FlutterView {
        // Récupérer le FlutterEngine du cache
        val flutterEngine = FlutterEngineCache
            .getInstance()
            .get(FlutterBridgeModule.ENGINE_ID)
            ?: throw IllegalStateException("FlutterEngine not found in cache")

        // Créer la FlutterView
        return FlutterView(reactContext).apply {
            attachToFlutterEngine(flutterEngine)
        }
    }

    override fun onDropViewInstance(view: FlutterView) {
        view.detachFromFlutterEngine()
        super.onDropViewInstance(view)
    }
}