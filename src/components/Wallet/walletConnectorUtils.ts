import { parseErrorMessage } from "@/utils/errorHandling";

type ConnectorLike = {
  type: string;
  getProvider?: () => Promise<unknown>;
};

type ConnectFn<TConnector extends ConnectorLike> = (params: {
  connector: TConnector;
}) => void;

type ConnectWithBrowserWalletArgs<TConnector extends ConnectorLike> = {
  browserInjectedConnector: TConnector | null;
  connect: ConnectFn<TConnector>;
  noBrowserWalletMessage: string;
  connectStartFailedMessage: string;
  onError: (message: string) => void;
  onSuccess?: () => void;
};

type ConnectWithWalletConnectArgs<TConnector extends ConnectorLike> = {
  walletConnectConnector: TConnector | null;
  isWalletConnectConfigured: boolean;
  connect: ConnectFn<TConnector>;
  walletConnectNotConfiguredMessage: string;
  connectStartFailedMessage: string;
  onError: (message: string) => void;
  onSuccess?: () => void;
};

export const resolveWalletConnectorOptions = <TConnector extends ConnectorLike>(
  connectors: readonly TConnector[],
  walletConnectProjectId: string
) => {
  const browserInjectedConnector =
    connectors.find((connector) => connector.type === "injected") ?? null;
  const walletConnectConnector =
    connectors.find((connector) => connector.type === "walletConnect") ?? null;

  const isWalletConnectConfigured = walletConnectProjectId.length > 0;
  const canUseBrowserWallet = Boolean(browserInjectedConnector);
  const canUseWalletConnect = Boolean(walletConnectConnector && isWalletConnectConfigured);
  const hasConnectorChoice = canUseBrowserWallet && canUseWalletConnect;
  const hasAnyAvailableConnector = canUseBrowserWallet || canUseWalletConnect;

  return {
    browserInjectedConnector,
    walletConnectConnector,
    isWalletConnectConfigured,
    canUseBrowserWallet,
    canUseWalletConnect,
    hasConnectorChoice,
    hasAnyAvailableConnector,
  };
};

export const connectWithBrowserWallet = async <TConnector extends ConnectorLike>({
  browserInjectedConnector,
  connect,
  noBrowserWalletMessage,
  connectStartFailedMessage,
  onError,
  onSuccess,
}: ConnectWithBrowserWalletArgs<TConnector>) => {
  if (!browserInjectedConnector) {
    onError(noBrowserWalletMessage);
    return;
  }

  try {
    const provider = await browserInjectedConnector.getProvider?.();
    if (!provider) {
      onError(noBrowserWalletMessage);
      return;
    }

    connect({ connector: browserInjectedConnector });
    onSuccess?.();
  } catch (connectError) {
    onError(parseErrorMessage(connectError, connectStartFailedMessage));
  }
};

export const connectWithWalletConnect = <TConnector extends ConnectorLike>({
  walletConnectConnector,
  isWalletConnectConfigured,
  connect,
  walletConnectNotConfiguredMessage,
  connectStartFailedMessage,
  onError,
  onSuccess,
}: ConnectWithWalletConnectArgs<TConnector>) => {
  if (!walletConnectConnector || !isWalletConnectConfigured) {
    onError(walletConnectNotConfiguredMessage);
    return;
  }

  try {
    connect({ connector: walletConnectConnector });
    onSuccess?.();
  } catch (connectError) {
    onError(parseErrorMessage(connectError, connectStartFailedMessage));
  }
};
