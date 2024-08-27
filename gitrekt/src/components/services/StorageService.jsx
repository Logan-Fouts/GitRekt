import EventBus from './EventBus';

class StorageService {
  constructor() {
    this.storageAvailable = false;
    this.checkAvailability();
  }

  async checkAvailability() {
    const maxAttempts = 20;
    const delay = 100;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (this.isLocalStorageAvailable()) {
        this.storageAvailable = true;
        return;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    console.warn('Local Storage is not available after multiple attempts');
  }

  async ensureAvailable() {
    if (!this.storageAvailable) {
      await this.checkAvailability();
      if (!this.storageAvailable) {
        throw new Error("Local Storage Not Available");
      }
    }
  }

  async getItem(key) {
    await this.ensureAvailable();
    return localStorage.getItem(key);
  }

  async setItem(key, val) {
    await this.ensureAvailable();
    localStorage.setItem(key, val);
    EventBus.dispatch('storageChanged', { key, value: val });
  }

  async removeItem(key) {
    await this.ensureAvailable();
    localStorage.removeItem(key);
  }

  async clearStorage() {
    await this.ensureAvailable();
    localStorage.clear();
  }

  isLocalStorageAvailable() {
    try {
      const testKey = "__test__";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export default StorageService;
