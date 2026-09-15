package com.novalauncher

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import java.nio.ByteBuffer
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

class NovaSecureStore(context: Context) {
    private val prefs = context.getSharedPreferences("nova_secure_values", Context.MODE_PRIVATE)
    private val alias = "nova_provider_keys"
    init {
        val store = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
        if (!store.containsAlias(alias)) {
            KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore").apply {
                init(KeyGenParameterSpec.Builder(alias, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
                    .setBlockModes(KeyProperties.BLOCK_MODE_GCM).setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE).build())
                generateKey()
            }
        }
    }
    fun put(name: String, value: String) {
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, key())
        val bytes = cipher.doFinal(value.toByteArray())
        val packed = ByteBuffer.allocate(4 + cipher.iv.size + bytes.size).putInt(cipher.iv.size).put(cipher.iv).put(bytes).array()
        prefs.edit().putString(name, Base64.encodeToString(packed, Base64.NO_WRAP)).apply()
    }
    fun get(name: String): String? {
        val encoded = prefs.getString(name, null) ?: return null
        return try {
            val packed = ByteBuffer.wrap(Base64.decode(encoded, Base64.NO_WRAP))
            val iv = ByteArray(packed.int); packed.get(iv)
            val bytes = ByteArray(packed.remaining()); packed.get(bytes)
            Cipher.getInstance("AES/GCM/NoPadding").run {
                init(Cipher.DECRYPT_MODE, key(), GCMParameterSpec(128, iv))
                String(doFinal(bytes))
            }
        } catch (_: Exception) { null }
    }
    private fun key(): SecretKey = (KeyStore.getInstance("AndroidKeyStore").apply { load(null) }.getKey(alias, null) as SecretKey)
}
