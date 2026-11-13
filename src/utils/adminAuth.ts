let inMemoryPasskey = '';

export function setAdminSessionPasskey(passkey: string): void {
  inMemoryPasskey = passkey;
  try {
    sessionStorage.setItem('banaya_admin_auth', 'true');
    sessionStorage.setItem('banaya_admin_passkey', passkey);
  } catch {
    // Ignore storage errors in restricted iframes; inMemoryPasskey remains active
  }
}

export function getAdminSessionPasskey(): string {
  if (inMemoryPasskey) return inMemoryPasskey;
  try {
    const stored = sessionStorage.getItem('banaya_admin_passkey') || '';
    if (stored) {
      inMemoryPasskey = stored;
    }
    return stored;
  } catch {
    return '';
  }
}

export function clearAdminSession(): void {
  inMemoryPasskey = '';
  try {
    sessionStorage.removeItem('banaya_admin_auth');
    sessionStorage.removeItem('banaya_admin_passkey');
  } catch {
    // Ignore storage errors
  }
}

export function hasAdminSession(): boolean {
  if (inMemoryPasskey) return true;
  try {
    return (
      sessionStorage.getItem('banaya_admin_auth') === 'true' &&
      Boolean(sessionStorage.getItem('banaya_admin_passkey'))
    );
  } catch {
    return false;
  }
}
