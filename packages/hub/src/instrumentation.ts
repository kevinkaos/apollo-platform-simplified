// Fix MaxListenersExceededWarning: Possible EventEmitter memory leak detected
// This warning occurs in development due to Next.js dev server and React Strict Mode
// re-mounting components that set up event listeners (like post-robot)

export async function register() {
  if (process.env.NODE_ENV === 'development') {
    // Increase the default max listeners limit for TLSSocket connections
    // This is safe in development and prevents spurious warnings
    const { EventEmitter } = await import('events');
    EventEmitter.defaultMaxListeners = 20;
  }
}
