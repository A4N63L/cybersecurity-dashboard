import { environment } from '../../../environments/environment';
export function logLocalDemoToken(action: string, token?: string): void {
  if (!environment.production && environment.demoTokenLogging && token &&
      ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) {
    console.info(`[DEMO LOCAL] JWT · ${action}`, token);
  }
}
