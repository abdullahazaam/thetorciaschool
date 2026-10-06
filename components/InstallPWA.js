'use client';

import { useState, useEffect } from 'react';
import { Share, X, PlusSquare } from 'lucide-react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if app is already installed in standalone mode
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsStandalone(isStandaloneMode);

    if (isStandaloneMode) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    setIsIOS(isIosDevice);

    // If on iOS and not in standalone, show the prompt button
    if (isIosDevice) {
      setIsVisible(true);
    }

    // Listen for Android / Chromium beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult && choiceResult.outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  if (isStandalone || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Floating Install App Button (Bottom Left, balancing against Chat Widget) */}
      <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-40 select-none">
        <button
          type="button"
          onClick={handleInstallClick}
          className="flex items-center gap-2 bg-[#991b1b] hover:bg-[#7f1d1d] text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 border border-white/20 text-xs sm:text-sm font-semibold tracking-wide"
          aria-label="Install App"
        >
          <svg
            className="w-4 h-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
            <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
            <path d="M12 7v6m-2.5-2.5L12 13l2.5-2.5" />
          </svg>
          <span>Install App</span>
        </button>
      </div>

      {/* iOS Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 relative text-gray-900">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#991b1b] text-white flex items-center justify-center shadow-md shrink-0">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
                  <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
                  <path d="M12 7v6m-2.5-2.5L12 13l2.5-2.5" />
                </svg>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Install Torcia School App</h3>
                <p className="text-xs text-gray-700">Add to iPhone Home Screen</p>
              </div>
            </div>

            {/* Instructions */}
            <p className="text-xs sm:text-sm text-gray-800 leading-relaxed mb-4">
              To install on iPhone: Tap the <strong className="font-semibold text-[#991b1b]">Share icon</strong> at the bottom of Safari, then select <strong className="font-semibold text-gray-900">'Add to Home Screen'</strong>.
            </p>

            {/* Step-by-step visual aid */}
            <div className="space-y-2.5 bg-red-50/60 border border-red-100 rounded-2xl p-3.5 mb-5 text-xs text-gray-700">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#991b1b] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <span>
                  Tap the Safari <span className="inline-flex items-center gap-1 font-semibold text-gray-900"><Share className="w-3.5 h-3.5 text-[#991b1b] inline" /> Share</span> icon below.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#991b1b] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <span>
                  Scroll down and tap <span className="inline-flex items-center gap-1 font-semibold text-gray-900"><PlusSquare className="w-3.5 h-3.5 text-[#991b1b] inline" /> Add to Home Screen</span>.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#991b1b] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <span>Tap <strong className="text-gray-900">Add</strong> in the top-right corner.</span>
              </div>
            </div>

            {/* Action button */}
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 rounded-full bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
