package com.novalauncher

import android.app.WallpaperManager
import android.content.Context
import android.graphics.BitmapFactory
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors

class NovaAiModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    private val prefs = context.getSharedPreferences("nova_ai_config", Context.MODE_PRIVATE)
    private val secure = NovaSecureStore(context)
    private val executor = Executors.newCachedThreadPool()
    private val defaults = mapOf(
        "openai" to Config("https://api.openai.com/v1", "gpt-4o-mini"),
        "gemini" to Config("https://generativelanguage.googleapis.com/v1beta", "gemini-2.0-flash"),
        "claude" to Config("https://api.anthropic.com/v1", "claude-3-5-haiku-latest"),
        "deepseek" to Config("https://api.deepseek.com/v1", "deepseek-chat"),
        "custom" to Config("", "local-model"),
    )
    override fun getName() = "NovaAi"

    @ReactMethod fun saveProvider(provider: String, apiKey: String, baseUrl: String, model: String, promise: Promise) {
        val name = provider.lowercase()
        val fallback = defaults[name] ?: return promise.reject("PROVIDER_UNKNOWN", "Unsupported provider")
        if (name != "custom" && apiKey.isBlank()) return promise.reject("API_KEY_REQUIRED", "Enter an API key")
        if (name == "custom" && baseUrl.isBlank()) return promise.reject("BASE_URL_REQUIRED", "Enter a custom endpoint URL")
        if (apiKey.isNotBlank()) secure.put("key_$name", apiKey.trim())
        prefs.edit().putString("base_$name", baseUrl.trim().ifBlank { fallback.base }).putString("model_$name", model.trim().ifBlank { fallback.model }).apply()
        promise.resolve(true)
    }

    @ReactMethod fun listProviders(promise: Promise) {
        val result = WritableNativeArray()
        defaults.forEach { (name, fallback) ->
            result.pushMap(WritableNativeMap().apply {
                putString("provider", name)
                putBoolean("configured", !secure.get("key_$name").isNullOrBlank() || (name == "custom" && !prefs.getString("base_$name", "").isNullOrBlank()))
                putString("baseUrl", prefs.getString("base_$name", fallback.base))
                putString("model", prefs.getString("model_$name", fallback.model))
            })
        }
        promise.resolve(result)
    }

    @ReactMethod fun chat(provider: String, prompt: String, promise: Promise) = runAsync(promise) { chatRequest(provider.lowercase(), prompt) }
    @ReactMethod fun generateWallpaper(provider: String, prompt: String, width: Int, height: Int, promise: Promise) = runAsync(promise) {
        val name = provider.lowercase()
        if (name != "openai" && name != "custom") error("Wallpaper generation requires an OpenAI-compatible image endpoint")
        val key = secure.get("key_$name").orEmpty()
        if (name != "custom" && key.isBlank()) error("Configure $name first")
        val config = config(name)
        val body = post("${config.base.trimEnd('/')}/images/generations", headers(key), JSONObject().put("model", if (name == "openai") "dall-e-3" else config.model).put("prompt", prompt).put("size", "${width}x${height}").put("n", 1).toString())
        val image = JSONObject(body).getJSONArray("data").getJSONObject(0)
        WritableNativeMap().apply { if (image.has("url")) putString("imageUrl", image.getString("url")); if (image.has("b64_json")) putString("imageBase64", image.getString("b64_json")) }
    }
    @ReactMethod fun applyWallpaper(imageUrl: String, promise: Promise) = executor.execute {
        try {
            val connection = URL(imageUrl).openConnection() as HttpURLConnection
            connection.connectTimeout = 20000; connection.readTimeout = 60000; connection.connect()
            connection.inputStream.use { input -> WallpaperManager.getInstance(context).setBitmap(BitmapFactory.decodeStream(input) ?: error("Unreadable image")) }
            promise.resolve(true)
        } catch (error: Exception) { promise.reject("WALLPAPER_APPLY_FAILED", error.message) }
    }

    private fun chatRequest(name: String, prompt: String): String {
        val key = secure.get("key_$name").orEmpty()
        if (name != "custom" && key.isBlank()) error("Configure $name first")
        val config = config(name)
        return when (name) {
            "gemini" -> {
                val body = post("${config.base}/models/${config.model}:generateContent?key=$key", mapOf("Content-Type" to "application/json"), JSONObject().put("contents", JSONArray().put(JSONObject().put("parts", JSONArray().put(JSONObject().put("text", prompt))))).toString())
                JSONObject(body).getJSONArray("candidates").getJSONObject(0).getJSONObject("content").getJSONArray("parts").getJSONObject(0).getString("text")
            }
            "claude" -> {
                val body = post("${config.base}/messages", mapOf("Content-Type" to "application/json", "x-api-key" to key, "anthropic-version" to "2023-06-01"), JSONObject().put("model", config.model).put("max_tokens", 1024).put("messages", JSONArray().put(JSONObject().put("role", "user").put("content", prompt))).toString())
                JSONObject(body).getJSONArray("content").getJSONObject(0).getString("text")
            }
            else -> {
                val body = post("${config.base.trimEnd('/')}/chat/completions", headers(key), JSONObject().put("model", config.model).put("messages", JSONArray().put(JSONObject().put("role", "user").put("content", prompt))).toString())
                JSONObject(body).getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content")
            }
        }
    }
    private fun config(name: String): Config {
        val fallback = defaults[name] ?: error("Unsupported provider")
        return Config(prefs.getString("base_$name", fallback.base).orEmpty().trimEnd('/'), prefs.getString("model_$name", fallback.model).orEmpty())
    }
    private fun headers(key: String): Map<String, String> = buildMap { put("Content-Type", "application/json"); if (key.isNotBlank()) put("Authorization", "Bearer $key") }
    private fun post(url: String, headers: Map<String, String>, payload: String): String {
        val connection = URL(url).openConnection() as HttpURLConnection
        connection.requestMethod = "POST"; connection.connectTimeout = 20000; connection.readTimeout = 120000; connection.doOutput = true
        headers.forEach { (key, value) -> connection.setRequestProperty(key, value) }
        connection.outputStream.use { it.write(payload.toByteArray()) }
        val status = connection.responseCode; val stream = if (status in 200..299) connection.inputStream else connection.errorStream
        val body = stream?.bufferedReader()?.use { it.readText() }.orEmpty()
        if (status !in 200..299) error("Provider returned HTTP $status: ${body.take(400)}")
        return body
    }
    private fun <T> runAsync(promise: Promise, task: () -> T) = executor.execute { try { promise.resolve(task()) } catch (error: Exception) { promise.reject("AI_REQUEST_FAILED", error.message) } }
    private data class Config(val base: String, val model: String)
}
