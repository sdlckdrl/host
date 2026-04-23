package com.fogbound.mafia

import android.annotation.SuppressLint
import android.app.Activity
import android.content.res.Configuration
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.view.View
import android.view.ViewGroup
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.Toast
import android.window.OnBackInvokedCallback
import android.window.OnBackInvokedDispatcher
import com.google.android.gms.ads.AdListener
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import java.util.Locale

class MainActivity : Activity() {
    private lateinit var webView: WebView
    private lateinit var webViewContainer: FrameLayout
    private lateinit var bannerContainer: FrameLayout

    private var bannerView: AdView? = null
    private var bannerLoaded = false
    private var bannerLoading = false
    private var interstitialAd: InterstitialAd? = null
    private var interstitialLoading = false
    private var adsInitialized = false
    private var currentPhase = "setup"
    private var completedGamesThisSession = 0
    private var awaitingNextGameApproval = false
    private var textToSpeech: TextToSpeech? = null
    private var ttsReady = false
    private var pendingSpeech: PendingSpeech? = null

    private var lastBackPressedAt = 0L
    private var exitToast: Toast? = null
    private val backCallback = OnBackInvokedCallback { handleBackPress() }
    private data class PendingSpeech(val text: String, val rate: Float, val pitch: Float)

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.setDecorFitsSystemWindows(true)
        }
        window.statusBarColor = Color.BLACK
        window.navigationBarColor = Color.BLACK

        setContentView(R.layout.activity_main)

        webViewContainer = findViewById(R.id.webview_container)
        bannerContainer = findViewById(R.id.banner_container)

        createBannerViewIfNeeded()

        webView = WebView(this).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT,
            )
            setBackgroundColor(Color.BLACK)
            fitsSystemWindows = true
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.allowFileAccess = true
            settings.allowContentAccess = true
            settings.cacheMode = WebSettings.LOAD_DEFAULT
            settings.useWideViewPort = true
            settings.loadWithOverviewMode = true
            settings.mediaPlaybackRequiresUserGesture = false
            overScrollMode = WebView.OVER_SCROLL_NEVER
            isVerticalScrollBarEnabled = false
            isHorizontalScrollBarEnabled = false
            addJavascriptInterface(GameBridge(), "AndroidBridge")
            webViewClient = WebViewClient()
            webChromeClient = WebChromeClient()
            loadUrl("file:///android_asset/web/index.html")
        }

        webViewContainer.addView(webView)
        initializeTextToSpeech()
        initializeAds()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            onBackInvokedDispatcher.registerOnBackInvokedCallback(
                OnBackInvokedDispatcher.PRIORITY_DEFAULT,
                backCallback,
            )
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            handleBackPress()
        }
    }

    override fun onResume() {
        super.onResume()
        if (::webView.isInitialized) {
            webView.onResume()
        }
        bannerView?.resume()
    }

    override fun onPause() {
        bannerView?.pause()
        if (::webView.isInitialized) {
            webView.onPause()
        }
        super.onPause()
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        rebuildBannerView()
        refreshBannerState()
        if (::webView.isInitialized) {
            webView.requestLayout()
        }
    }

    private fun initializeAds() {
        Thread {
            MobileAds.initialize(this) {
                runOnUiThread {
                    adsInitialized = true
                    loadInterstitialAdIfNeeded()
                    refreshBannerState()
                }
            }
        }.start()
    }

    private fun createBannerViewIfNeeded() {
        if (bannerView != null) {
            return
        }

        bannerView = AdView(this).apply {
            adUnitId = getString(R.string.admob_banner_unit_id)
            setBackgroundColor(Color.TRANSPARENT)
            adListener = object : AdListener() {
                override fun onAdLoaded() {
                    bannerLoaded = true
                    bannerLoading = false
                    refreshBannerState()
                }

                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    bannerLoaded = false
                    bannerLoading = false
                    refreshBannerState()
                }
            }
        }

        bannerContainer.addView(
            bannerView,
            FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
            ),
        )
    }

    private fun rebuildBannerView() {
        bannerContainer.removeAllViews()
        bannerView?.destroy()
        bannerView = null
        bannerLoaded = false
        bannerLoading = false
        createBannerViewIfNeeded()
    }

    private fun refreshBannerState() {
        if (!adsInitialized) {
            bannerContainer.visibility = View.GONE
            return
        }

        if (completedGamesThisSession >= 1) {
            loadBannerAdIfNeeded()
        }

        bannerContainer.visibility = if (shouldShowBanner() && bannerLoaded) {
            View.VISIBLE
        } else {
            View.GONE
        }
    }

    private fun shouldShowBanner(): Boolean {
        return currentPhase == "setup" && completedGamesThisSession >= 1
    }

    private fun loadBannerAdIfNeeded() {
        val adView = bannerView ?: return
        if (bannerLoaded || bannerLoading) {
            return
        }

        bannerContainer.post {
            val density = resources.displayMetrics.density
            val availableWidthPx = if (bannerContainer.width > 0) {
                bannerContainer.width
            } else {
                resources.displayMetrics.widthPixels
            }
            val adWidth = (availableWidthPx / density).toInt().coerceAtLeast(1)
            adView.setAdSize(AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(this, adWidth))

            if (bannerLoaded || bannerLoading) {
                return@post
            }

            bannerLoading = true
            adView.loadAd(AdRequest.Builder().build())
        }
    }

    private fun loadInterstitialAdIfNeeded() {
        if (!adsInitialized || interstitialLoading || interstitialAd != null) {
            return
        }

        interstitialLoading = true
        InterstitialAd.load(
            this,
            getString(R.string.admob_interstitial_unit_id),
            AdRequest.Builder().build(),
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    interstitialLoading = false
                    interstitialAd = ad
                }

                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    interstitialLoading = false
                    interstitialAd = null
                }
            },
        )
    }

    private fun handleNextGameRequest() {
        if (awaitingNextGameApproval) {
            return
        }

        awaitingNextGameApproval = true

        if (completedGamesThisSession < 1) {
            approveNextGameStart()
            return
        }

        val ad = interstitialAd
        if (ad == null) {
            loadInterstitialAdIfNeeded()
            approveNextGameStart()
            return
        }

        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                interstitialAd = null
                loadInterstitialAdIfNeeded()
                approveNextGameStart()
            }

            override fun onAdFailedToShowFullScreenContent(adError: com.google.android.gms.ads.AdError) {
                interstitialAd = null
                loadInterstitialAdIfNeeded()
                approveNextGameStart()
            }

            override fun onAdShowedFullScreenContent() {
                interstitialAd = null
            }
        }

        ad.show(this)
    }

    private fun approveNextGameStart() {
        awaitingNextGameApproval = false
        if (!::webView.isInitialized) {
            return
        }

        webView.post {
            webView.evaluateJavascript(
                """
                (function () {
                  if (typeof window.handleNativeNextGameApproval === "function") {
                    window.handleNativeNextGameApproval();
                  }
                })();
                """.trimIndent(),
                null,
            )
        }
    }

    private fun handleBackPress() {
        if (::webView.isInitialized && webView.canGoBack()) {
            lastBackPressedAt = 0L
            exitToast?.cancel()
            webView.goBack()
            return
        }

        val now = System.currentTimeMillis()
        if (now - lastBackPressedAt < 2000L) {
            exitToast?.cancel()
            finishAffinity()
            return
        }

        lastBackPressedAt = now
        exitToast?.cancel()
        exitToast = Toast.makeText(this, getString(R.string.exit_prompt), Toast.LENGTH_SHORT)
        exitToast?.show()
    }

    override fun onDestroy() {
        exitToast?.cancel()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            onBackInvokedDispatcher.unregisterOnBackInvokedCallback(backCallback)
        }
        bannerView?.destroy()
        textToSpeech?.stop()
        textToSpeech?.shutdown()
        textToSpeech = null
        if (::webView.isInitialized) {
            webView.destroy()
        }
        super.onDestroy()
    }

    private fun initializeTextToSpeech() {
        if (textToSpeech != null) {
            return
        }

        textToSpeech = TextToSpeech(this) { status ->
            val engine = textToSpeech ?: return@TextToSpeech
            if (status != TextToSpeech.SUCCESS) {
                ttsReady = false
                return@TextToSpeech
            }

            val koreanResult = engine.setLanguage(Locale.KOREAN)
            ttsReady =
                koreanResult != TextToSpeech.LANG_MISSING_DATA &&
                koreanResult != TextToSpeech.LANG_NOT_SUPPORTED

            if (!ttsReady) {
                val fallbackResult = engine.setLanguage(Locale.getDefault())
                ttsReady =
                    fallbackResult != TextToSpeech.LANG_MISSING_DATA &&
                    fallbackResult != TextToSpeech.LANG_NOT_SUPPORTED
            }

            val queuedSpeech = pendingSpeech ?: return@TextToSpeech
            pendingSpeech = null
            speakNarration(queuedSpeech.text, queuedSpeech.rate, queuedSpeech.pitch)
        }
    }

    private fun speakNarration(text: String, rate: Float, pitch: Float) {
        val message = text.trim()
        if (message.isEmpty()) {
            return
        }

        val engine = textToSpeech
        if (engine == null) {
            pendingSpeech = PendingSpeech(message, rate, pitch)
            initializeTextToSpeech()
            return
        }

        if (!ttsReady) {
            pendingSpeech = PendingSpeech(message, rate, pitch)
            return
        }

        engine.stop()
        engine.setSpeechRate(rate.coerceIn(0.5f, 1.4f))
        engine.setPitch(pitch.coerceIn(0.6f, 1.4f))

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            engine.speak(message, TextToSpeech.QUEUE_FLUSH, null, "fogbound-narration")
        } else {
            @Suppress("DEPRECATION")
            engine.speak(message, TextToSpeech.QUEUE_FLUSH, null)
        }
    }

    private inner class GameBridge {
        @JavascriptInterface
        fun onPhaseChanged(phase: String?) {
            val safePhase = phase ?: return
            runOnUiThread {
                currentPhase = safePhase
                refreshBannerState()
            }
        }

        @JavascriptInterface
        fun onGameFinished() {
            runOnUiThread {
                completedGamesThisSession += 1
                loadInterstitialAdIfNeeded()
                refreshBannerState()
            }
        }

        @JavascriptInterface
        fun requestNextGameStart() {
            runOnUiThread {
                handleNextGameRequest()
            }
        }

        @JavascriptInterface
        fun speakText(text: String?, rate: Float, pitch: Float) {
            val safeText = text?.trim().orEmpty()
            if (safeText.isEmpty()) {
                return
            }

            runOnUiThread {
                speakNarration(safeText, rate, pitch)
            }
        }

        @JavascriptInterface
        fun stopNarration() {
            runOnUiThread {
                textToSpeech?.stop()
            }
        }
    }
}
