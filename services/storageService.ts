
import { SavedProject } from '../types';

const DB_NAME = 'KalpanaForgeDB';
const STORE_NAME = 'projects';
const DB_VERSION = 1;

// Initialize the database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Create object store with 'id' as key path
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

// Save a project to the repository
export const saveProjectToRepo = async (project: SavedProject): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(project);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to save project", e);
    throw e;
  }
};

// Load all projects from the repository
export const getAllProjects = async (): Promise<SavedProject[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        // Sort by last modified descending
        const projects = (request.result as SavedProject[]).sort((a, b) => b.lastModified - a.lastModified);
        resolve(projects);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to load projects", e);
    return [];
  }
};

// Delete a project
export const deleteProjectFromRepo = async (id: string): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to delete project", e);
    throw e;
  }
};
