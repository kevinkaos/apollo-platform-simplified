import postRobot from 'post-robot';
import type {
  HubMessage,
  BreadcrumbItem,
  User,
  SidebarState,
  RouteChangePayload,
} from '@apollo/shared';

type NavigateHandler = (path: string) => void;
type BreadcrumbHandler = (items: BreadcrumbItem[]) => void;
type LoadingHandler = (loading: boolean) => void;
type LogoutHandler = () => void;
type ErrorHandler = (code: 403 | 404 | 500) => void;
type SidebarStateHandler = (state: SidebarState) => void;

interface HubMessagingConfig {
  onNavigate: NavigateHandler;
  onBreadcrumbsChange: BreadcrumbHandler;
  onLoadingChange: LoadingHandler;
  onLogout: LogoutHandler;
  onError: ErrorHandler;
  onSidebarStateChange: SidebarStateHandler;
  getUser: () => User | null;
  getSidebarState: () => SidebarState;
  getCurrentRoute: () => { path: string; query?: Record<string, string> };
}

let cancelListeners: (() => void)[] = [];

export function initHubMessaging(config: HubMessagingConfig) {
  // Clean up any existing listeners
  cancelListeners.forEach((cancel) => cancel());
  cancelListeners = [];

  // Listen for navigation requests from iframe
  const cancelNavigate = postRobot.on<{ path: string }>('NAVIGATE', ({ data }) => {
    config.onNavigate(data.path);
  });
  cancelListeners.push(cancelNavigate.cancel);

  // Listen for breadcrumb updates
  const cancelBreadcrumbs = postRobot.on<{ items: BreadcrumbItem[] }>(
    'SET_BREADCRUMBS',
    ({ data }) => {
      config.onBreadcrumbsChange(data.items);
    }
  );
  cancelListeners.push(cancelBreadcrumbs.cancel);

  // Listen for loading state changes
  const cancelLoading = postRobot.on<{ loading: boolean }>('SET_LOADING', ({ data }) => {
    config.onLoadingChange(data.loading);
  });
  cancelListeners.push(cancelLoading.cancel);

  // Respond to user data requests
  const cancelGetUser = postRobot.on('GET_USER', () => {
    return { user: config.getUser() };
  });
  cancelListeners.push(cancelGetUser.cancel);

  // Listen for module ready signal
  const cancelReady = postRobot.on<{ moduleId: string }>('READY', ({ data }) => {
    console.log(`Module ready: ${data.moduleId}`);
    config.onLoadingChange(false);
  });
  cancelListeners.push(cancelReady.cancel);

  // Listen for logout requests
  const cancelLogout = postRobot.on('LOGOUT', () => {
    config.onLogout();
  });
  cancelListeners.push(cancelLogout.cancel);

  // Listen for error reports
  const cancelError = postRobot.on<{ code: 403 | 404 | 500 }>('ERROR', ({ data }) => {
    config.onError(data.code);
  });
  cancelListeners.push(cancelError.cancel);

  // Respond to sidebar state requests
  const cancelGetSidebarState = postRobot.on('GET_SIDEBAR_STATE', () => {
    return config.getSidebarState();
  });
  cancelListeners.push(cancelGetSidebarState.cancel);

  // Listen for sidebar state updates
  const cancelSetSidebarState = postRobot.on<SidebarState>('SET_SIDEBAR_STATE', ({ data }) => {
    config.onSidebarStateChange(data);
  });
  cancelListeners.push(cancelSetSidebarState.cancel);

  // Respond to initial route requests
  const cancelGetInitialRoute = postRobot.on('GET_INITIAL_ROUTE', () => {
    return config.getCurrentRoute();
  });
  cancelListeners.push(cancelGetInitialRoute.cancel);

  return () => {
    cancelListeners.forEach((cancel) => cancel());
    cancelListeners = [];
  };
}

export function sendToModule(iframe: HTMLIFrameElement, message: HubMessage): Promise<void> {
  return postRobot.send(
    iframe.contentWindow,
    message.type,
    (message as { payload?: unknown }).payload
  ) as Promise<void>;
}

export function sendRouteChangeToModule(
  iframe: HTMLIFrameElement,
  payload: RouteChangePayload
): Promise<void> {
  return postRobot.send(iframe.contentWindow, 'ROUTE_CHANGE', payload) as Promise<void>;
}
