// ============================================
// Shared types between Hub and SDK
// ============================================

export interface ModuleConfig {
  id: string;
  name: string;
  url: string;
  pathPrefix: string;
  icon?: string;
}

// ============================================
// Navigation types (3-level hierarchy)
// ============================================

export interface NavLevel3 {
  id: string;
  label: string;
  path: string;
}

export interface NavLevel2 {
  id: string;
  label: string;
  children: NavLevel3[];
}

export interface NavLevel1 {
  id: string;
  label: string;
  icon?: string;
  children: NavLevel2[];
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// ============================================
// Sidebar State
// ============================================

export interface SidebarState {
  collapsed: boolean;
  expandedSections: string[];
}

// ============================================
// Message types for postMessage communication
// ============================================

// SDK → Hub messages
export type MessageType =
  | 'NAVIGATE'
  | 'READY'
  | 'SET_BREADCRUMBS'
  | 'SET_LOADING'
  | 'GET_USER'
  | 'LOGOUT'
  | 'ERROR'
  | 'GET_SIDEBAR_STATE'
  | 'SET_SIDEBAR_STATE'
  | 'GET_INITIAL_ROUTE';

// Hub → SDK messages
export type HubToSdkMessageType = 'ROUTE_CHANGE' | 'USER_DATA' | 'SIDEBAR_STATE' | 'INITIAL_ROUTE';

export interface BaseMessage {
  type: MessageType;
}

export interface NavigateMessage extends BaseMessage {
  type: 'NAVIGATE';
  payload: { path: string };
}

export interface ReadyMessage extends BaseMessage {
  type: 'READY';
  payload: { moduleId: string };
}

export interface SetBreadcrumbsMessage extends BaseMessage {
  type: 'SET_BREADCRUMBS';
  payload: { items: BreadcrumbItem[] };
}

export interface SetLoadingMessage extends BaseMessage {
  type: 'SET_LOADING';
  payload: { loading: boolean };
}

export interface LogoutMessage extends BaseMessage {
  type: 'LOGOUT';
}

export interface ErrorMessage extends BaseMessage {
  type: 'ERROR';
  payload: { code: 403 | 404 | 500 };
}

export interface SetSidebarStateMessage extends BaseMessage {
  type: 'SET_SIDEBAR_STATE';
  payload: SidebarState;
}

// Hub → SDK message payloads
export interface RouteChangePayload {
  path: string;
  query?: Record<string, string>;
}

export interface InitialRoutePayload {
  path: string;
  query?: Record<string, string>;
}

export type HubMessage =
  | NavigateMessage
  | ReadyMessage
  | SetBreadcrumbsMessage
  | SetLoadingMessage
  | LogoutMessage
  | ErrorMessage
  | SetSidebarStateMessage;
