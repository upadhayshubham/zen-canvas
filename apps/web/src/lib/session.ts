import { v4 as uuidv4 } from 'uuid';

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('zc_session');
  if (!id) {
    id = uuidv4();
    localStorage.setItem('zc_session', id);
  }
  return id;
}
