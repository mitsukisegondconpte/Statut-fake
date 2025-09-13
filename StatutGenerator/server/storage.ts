// Simple storage interface for the WhatsApp generator
// Since this app doesn't require user management, we'll keep it minimal

export interface IStorage {
  // Storage methods can be extended here if needed
}

export class MemStorage implements IStorage {
  constructor() {
    // Simple memory storage ready for future extensions
  }
}

export const storage = new MemStorage();
