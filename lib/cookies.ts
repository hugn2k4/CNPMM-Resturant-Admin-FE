/**
 * Cookie utilities for managing authentication tokens
 */

export const cookieUtils = {
  /**
   * Set a cookie
   */
  set(name: string, value: string, days: number = 1) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
  },

  /**
   * Get a cookie value
   */
  get(name: string): string | null {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  },

  /**
   * Delete a cookie
   */
  delete(name: string) {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },

  /**
   * Check if cookie exists
   */
  has(name: string): boolean {
    return this.get(name) !== null;
  },
};
