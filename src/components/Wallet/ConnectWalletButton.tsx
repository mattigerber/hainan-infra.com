"use client";

import { useState, useRef, useEffect, useSyncExternalStore, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import { walletConnectProjectId } from './WalletProvider';
import ToastNotification from '@/components/Feedback/ToastNotification';
import WalletConnectDisclaimerModal from '@/components/Wallet/WalletConnectDisclaimerModal';
import { useWalletConnectDisclaimer } from '@/components/Wallet/useWalletConnectDisclaimer';
import {
  connectWithBrowserWallet as runBrowserWalletConnect,
  connectWithWalletConnect as runWalletConnect,
  resolveWalletConnectorOptions,
} from '@/components/Wallet/walletConnectorUtils';
import { useI18n } from '@/i18n/I18nProvider';
import { parseErrorMessage } from '@/utils/errorHandling';

const ConnectWalletButton = () => {
  const { t, locale } = useI18n();
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, error, status } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const [showPopup, setShowPopup] = useState(false);
  const [showConnectorMenu, setShowConnectorMenu] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const connectorMenuRef = useRef<HTMLDivElement>(null);
  const [walletActionError, setWalletActionError] = useState<string | null>(null);
  const [dismissedConnectError, setDismissedConnectError] = useState<string | null>(null);
  const {
    isDisclaimerOpen,
    requestWithDisclaimer,
    confirmDisclaimer,
    cancelDisclaimer,
  } = useWalletConnectDisclaimer();
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  
  const {
    browserInjectedConnector,
    walletConnectConnector,
    isWalletConnectConfigured,
    canUseBrowserWallet,
    canUseWalletConnect,
    hasConnectorChoice,
    hasAnyAvailableConnector,
  } = resolveWalletConnectorOptions(connectors, walletConnectProjectId);
  const isConnecting = status === 'pending';
  const isArabic = locale === 'ar';
  const isSmallViewport = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;
  const shouldShowConnectorChoice = isHydrated && hasConnectorChoice;
  const walletConnectWarmupStartedRef = useRef(false);

  const warmupWalletConnect = useCallback(() => {
    if (walletConnectWarmupStartedRef.current) {
      return;
    }

    if (!walletConnectConnector || !isWalletConnectConfigured) {
      return;
    }

    walletConnectWarmupStartedRef.current = true;

    // Pre-initialize provider to avoid first-click QR modal lag.
    void walletConnectConnector.getProvider?.().catch(() => {
      walletConnectWarmupStartedRef.current = false;
    });
  }, [walletConnectConnector, isWalletConnectConfigured]);

  const isUserRejectedError = (value: unknown) => {
    const message = parseErrorMessage(value, '').toLowerCase();
    return (
      message.includes('user rejected') ||
      message.includes('rejected the request') ||
      message.includes('connection request reset')
    );
  };

  const clearStaleWalletStorage = () => {
    if (typeof window === 'undefined') return;

    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('wc@2') || key.startsWith('wagmi'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  };

  const connectErrorMessage = error && !isUserRejectedError(error)
    ? parseErrorMessage(error, t('wallet.error.connectionFailed'))
    : null;
  const shouldShowConnectError =
    Boolean(connectErrorMessage) && connectErrorMessage !== dismissedConnectError;
  const activeToastMessage = walletActionError ?? (shouldShowConnectError ? connectErrorMessage : null);

  // Close WalletConnect modal after successful connection
  useEffect(() => {
    if (isConnected && connector?.type === 'walletConnect') {
      // Give modal time to close naturally, then force close if needed
      const timer = setTimeout(() => {
        try {
          // Close any open WalletConnect modals
          const wcModals = document.querySelectorAll('wcm-modal, w3m-modal, wc-modal');
          wcModals.forEach((modal) => {
            const closeButton = modal.shadowRoot?.querySelector('[data-testid="wui-modal-close-button"], button[aria-label="Close"]') as HTMLElement;
            if (closeButton) {
              closeButton.click();
            }
          });
        } catch (err) {
          console.debug('Wallet modal close skipped:', err);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, connector]);

  // Handle WalletConnect errors and clear stale sessions
  useEffect(() => {
    if (error) {
      if (isUserRejectedError(error)) {
        return;
      }

      console.error('Wallet connection error:', error);
      
      // If there's a WalletConnect session error, clear localStorage and disconnect
      if (error.message?.includes('session topic') || error.message?.includes('No matching key')) {
        console.log('Clearing stale WalletConnect session...');
        clearStaleWalletStorage();
        
        // Force disconnect to reset state
        disconnect();
      }
    }
  }, [error, disconnect]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }

      if (connectorMenuRef.current && !connectorMenuRef.current.contains(event.target as Node)) {
        setShowConnectorMenu(false);
      }
    };

    if (showPopup || showConnectorMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup, showConnectorMenu]);

  useEffect(() => {
    if (!(showPopup || showConnectorMenu) || typeof document === 'undefined') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowPopup(false);
        setShowConnectorMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPopup, showConnectorMenu]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') {
      return;
    }

    const warmupTimer = window.setTimeout(() => {
      warmupWalletConnect();
    }, 900);

    return () => {
      window.clearTimeout(warmupTimer);
    };
  }, [isHydrated, warmupWalletConnect]);

  const handleDisconnect = () => {
    try {
      disconnect();
      clearStaleWalletStorage();
      setShowPopup(false);
      setWalletActionError(null);
    } catch (disconnectError) {
      setWalletActionError(parseErrorMessage(disconnectError, t('wallet.error.disconnectFailed')));
    }
  };

  const handleSwitchChain = (newChainId: number) => {
    try {
      switchChain({ chainId: newChainId });
      setWalletActionError(null);
    } catch (switchError) {
      setWalletActionError(parseErrorMessage(switchError, t('wallet.error.switchFailed')));
    }
  };

  const connectWithBrowserWallet = () => {
    void runBrowserWalletConnect({
      browserInjectedConnector,
      connect,
      noBrowserWalletMessage: t('wallet.error.noBrowserWallet'),
      connectStartFailedMessage: t('wallet.error.connectStartFailed'),
      onError: (message) => setWalletActionError(message),
      onSuccess: () => {
        setWalletActionError(null);
        setDismissedConnectError(null);
        setShowConnectorMenu(false);
      },
    });
  };

  const connectWithWalletConnect = () => {
    runWalletConnect({
      walletConnectConnector,
      isWalletConnectConfigured,
      connect,
      walletConnectNotConfiguredMessage: t('wallet.error.walletConnectNotConfigured'),
      connectStartFailedMessage: t('wallet.error.connectStartFailed'),
      onError: (message) => setWalletActionError(message),
      onSuccess: () => {
        setWalletActionError(null);
        setDismissedConnectError(null);
        setShowConnectorMenu(false);
        setShowPopup(false);
      },
    });
  };

  const startConnectFlow = () => {
    if (!hasAnyAvailableConnector) {
      setWalletActionError(t('wallet.error.noConnector'));
      return false;
    }

    if (hasConnectorChoice && !isSmallViewport) {
      warmupWalletConnect();
      setShowConnectorMenu((current) => !current);
      return true;
    }

    if (hasConnectorChoice && isSmallViewport && canUseWalletConnect) {
      connectWithWalletConnect();
      return true;
    }

    if (canUseBrowserWallet) {
      connectWithBrowserWallet();
      return true;
    }

    connectWithWalletConnect();
    return true;
  };

  const handleConnect = () => {
    requestWithDisclaimer(startConnectFlow);
  };

  const handleCloseErrorToast = () => {
    if (walletActionError) {
      setWalletActionError(null);
      return;
    }

    if (connectErrorMessage) {
      setDismissedConnectError(connectErrorMessage);
    }
  };

  const currentChainName = chainId === mainnet.id ? 'Ethereum Mainnet' : 'Unknown';

  return (
    <div className="relative w-full sm:w-auto">
      {isConnected && address ? (
        <>
          <button
            type="button"
            className="group relative inline-flex w-full min-h-[42px] items-center justify-center gap-2 border border-white bg-white px-3 py-2 font-playfair text-xs text-black transition hover:border-white/70 sm:w-auto sm:px-4 sm:text-sm"
            onClick={() => setShowPopup(!showPopup)}
            aria-label={t('wallet.openSettings')}
            aria-haspopup="dialog"
            aria-expanded={showPopup}
            aria-controls="wallet-settings-popover"
          >
            {/* Connection status marker */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-black/75 border border-black/40"></span>
            </span>
            <span className="sr-only">{t('wallet.connectedAddress')}</span>
            <span aria-hidden="true">{address.slice(0, 6)}...{address.slice(-4)}</span>
          </button>

          {/* Popup Modal */}
          {showPopup && (
            <div
              id="wallet-settings-popover"
              ref={popupRef}
              role="dialog"
              aria-modal="false"
              aria-label={t('wallet.settingsTitle')}
              className={`absolute top-full z-50 mt-2 w-[min(88vw,16rem)] border border-white bg-black p-4 shadow-lg ${
                isArabic ? 'left-0 right-auto' : 'right-0'
              }`}
            >
              <h3 className="font-playfair text-sm font-bold mb-3 text-white">{t('wallet.settingsTitle')}</h3>
              
              {/* Chain Selection */}
              <div className="mb-4">
                <label className="text-xs text-white/70 mb-2 block">{t('wallet.selectNetwork')}</label>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchChain(mainnet.id)}
                    className={`px-3 py-2 text-left text-sm transition ${
                      chainId === mainnet.id
                        ? 'bg-white text-black'
                        : 'border border-white/30 text-white hover:border-white'
                    }`}
                  >
                    {t('wallet.ethereumMainnet')} {chainId === mainnet.id && '✓'}
                  </button>
                </div>
              </div>

              {/* Current Network */}
              <div className="mb-4 pb-3 border-b border-white/20">
                <div className="text-xs text-white/70">{t('wallet.connectedTo')}</div>
                <div className="text-sm text-white font-playfair mt-1">{currentChainName}</div>
              </div>

              {/* Disconnect Button */}
              <button
                type="button"
                onClick={handleDisconnect}
                className="w-full px-3 py-2 border border-white text-white hover:bg-white hover:text-black transition font-playfair text-sm"
              >
                {t('wallet.disconnect')}
              </button>
            </div>
          )}
        </>
      ) : (
        <div ref={connectorMenuRef} className="relative">
          <button
            type="button"
            className="inline-flex w-full min-h-[42px] items-center justify-center gap-2 border border-white bg-white px-3 py-2 font-playfair text-xs text-black transition hover:bg-white/90 sm:w-auto sm:px-4 sm:text-sm"
            onClick={handleConnect}
            onMouseEnter={warmupWalletConnect}
            onFocus={warmupWalletConnect}
            disabled={isConnecting}
            aria-haspopup={shouldShowConnectorChoice ? 'menu' : undefined}
            aria-expanded={shouldShowConnectorChoice ? showConnectorMenu : undefined}
            aria-controls={shouldShowConnectorChoice ? 'wallet-connector-menu' : undefined}
          >
            {isConnecting ? t('wallet.connecting') : t('wallet.connect')}
            {shouldShowConnectorChoice && !isConnecting ? <span aria-hidden="true">▾</span> : null}
          </button>

          {showConnectorMenu && shouldShowConnectorChoice ? (
            <div
              id="wallet-connector-menu"
              role="menu"
              aria-label={t('wallet.connectorMenu')}
              className={`absolute z-50 mt-2 w-[min(86vw,14rem)] border border-white bg-black p-2 shadow-lg ${
                isArabic ? 'left-0 right-auto' : 'right-0'
              }`}
            >
              <button
                type="button"
                onClick={connectWithBrowserWallet}
                role="menuitem"
                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10 transition"
              >
                {t('wallet.browserWallet')}
              </button>
              <button
                type="button"
                onClick={connectWithWalletConnect}
                role="menuitem"
                className="mt-1 w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10 transition"
              >
                {t('wallet.walletConnect')}
              </button>
            </div>
          ) : null}
        </div>
      )}
      {activeToastMessage ? (
        <ToastNotification
          message={activeToastMessage}
          tone="error"
          isVisible={true}
          onClose={handleCloseErrorToast}
        />
      ) : null}
      <WalletConnectDisclaimerModal
        isOpen={isDisclaimerOpen}
        onConfirm={confirmDisclaimer}
        onCancel={cancelDisclaimer}
      />
    </div>
  );
};

export default ConnectWalletButton;
