export function getSessionKey(): string {
  let key = localStorage.getItem('balloon_session_key')
  if (!key) {
    key = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9)
    localStorage.setItem('balloon_session_key', key)
  }
  return key
}
