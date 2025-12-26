import postRobot from 'post-robot';
import {
  BreadcrumbItem,
  User,
  SidebarState,
  InitialRoutePayload,
  RouteChangePayload,
} from '../../shared/types';

interface HubClient {
  navigate: (path: string) => Promise<void>;
  setBreadcrumbs: (items: BreadcrumbItem[]) => Promise<void>;
  setLoading: (loading: boolean) => Promise<void>;
  getUser: () => Promise<User | null>;
  notifyReady: (moduleId: string) => Promise<void>;
  logout: () => Promise<void>;
  reportError: (code: 403 | 404 | 500) => Promise<void>;
  getSidebarState: () => Promise<SidebarState>;
  setSidebarState: (state: SidebarState) => Promise<void>;
  getInitialRoute: () => Promise<InitialRoutePayload>;
  onRouteChange: (handler: (payload: RouteChangePayload) => void) => () => void;
}

let isInitialized = false;

function sendToHub<T = void>(type: string, payload?: unknown): Promise<T> {
  if (!isRunningInHub()) {
    return Promise.resolve(undefined as T);
  }
  return postRobot.send(window.parent, type, payload).then((res) => (res as { data: T }).data);
}

export const hubClient: HubClient = {
  navigate: (path: string) => sendToHub('NAVIGATE', { path }),

  setBreadcrumbs: (items: BreadcrumbItem[]) => sendToHub('SET_BREADCRUMBS', { items }),

  setLoading: (loading: boolean) => sendToHub('SET_LOADING', { loading }),

  getUser: () => sendToHub<{ user: User | null }>('GET_USER').then((res) => res?.user ?? null),

  notifyReady: (moduleId: string) => sendToHub('READY', { moduleId }),

  logout: () => sendToHub('LOGOUT'),

  reportError: (code: 403 | 404 | 500) => sendToHub('ERROR', { code }),

  getSidebarState: () =>
    sendToHub<SidebarState>('GET_SIDEBAR_STATE').then(
      (res) => res ?? { collapsed: false, expandedSections: [] }
    ),

  setSidebarState: (state: SidebarState) => sendToHub('SET_SIDEBAR_STATE', state),

  getInitialRoute: () =>
    sendToHub<InitialRoutePayload>('GET_INITIAL_ROUTE').then(
      (res) => res ?? { path: '/', query: {} }
    ),

  onRouteChange: (handler: (payload: RouteChangePayload) => void) => {
    if (!isRunningInHub()) {
      return () => {};
    }
    const listener = postRobot.on('ROUTE_CHANGE', ({ data }) => {
      handler(data as RouteChangePayload);
    });
    return () => listener.cancel();
  },
};

export function initSdk(moduleId: string): void {
  if (isInitialized) {
    console.warn('[Apollo SDK] Already initialized');
    return;
  }

  isInitialized = true;

  // Notify hub that this module is ready
  hubClient.notifyReady(moduleId);
}

export function isRunningInHub(): boolean {
  return typeof window !== 'undefined' && window !== window.parent;
}
