import fs from "fs/promises";
import path from "path";
import { ProcessedFile } from "./file-processor";
import { SearchEngine } from "./search-engine";

export class FileStorage {
  private static instance: FileStorage;
  private searchEngine: SearchEngine;
  private storageDir: string;
  private metadataFile: string;

  private constructor() {
    this.searchEngine = new SearchEngine();
    this.storageDir = path.join(process.cwd(), "uploads");
    this.metadataFile = path.join(this.storageDir, "metadata.json");
    this.initializeStorage();
  }

  static getInstance(): FileStorage {
    if (!FileStorage.instance) {
      FileStorage.instance = new FileStorage();
    }
    return FileStorage.instance;
  }

  private async initializeStorage(): Promise<void> {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
      console.log("qwe")
      await this.loadMetadata();
    } catch {
      console.error("Failed to initialize storage");
    }
  }

  private async loadMetadata(): Promise<void> {
    try {
      const data = await fs.readFile(this.metadataFile, "utf-8");
      const files: ProcessedFile[] = JSON.parse(data);
      for (const file of files) {
        file.uploadedAt = new Date(file.uploadedAt);
        this.searchEngine.addFile(file);
      }
    } catch {
      console.log("No existing metadata file found, starting fresh");
    }
  }

  private async saveMetadata(): Promise<void> {
    const files = this.searchEngine.getAllFiles();
    await fs.writeFile(this.metadataFile, JSON.stringify(files, null, 2));
  }

  async storeFile(file: ProcessedFile, buffer: Buffer): Promise<void> {
    const filePath = path.join(this.storageDir, `${file.id}.bin`);
    await fs.writeFile(filePath, buffer);

    this.searchEngine.addFile(file);
    await this.saveMetadata();
  }

  async getFile(fileId: string): Promise<ProcessedFile | null> {
    const files = this.searchEngine.getAllFiles();
    return files.find((f) => f.id === fileId) || null;
  }

  async getFileContent(fileId: string): Promise<Buffer | null> {
    try {
      const filePath = path.join(this.storageDir, `${fileId}.bin`);
      return await fs.readFile(filePath);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      const filePath = path.join(this.storageDir, `${fileId}.bin`);
      await fs.unlink(filePath);
    } catch {
      console.error("Failed to delete file");
    }

    this.searchEngine.removeFile(fileId);
    await this.saveMetadata();
  }

  search(query: string) {
    return this.searchEngine.search(query);
  }

  getAllFiles(): ProcessedFile[] {
    return this.searchEngine.getAllFiles();
  }

  getStats() {
    const files = this.getAllFiles();
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    const typeStats = files.reduce((acc, file) => {
      acc[file.type] = (acc[file.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalFiles: files.length,
      totalSize,
      typeStats,
      recentFiles: files
        .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
        .slice(0, 5),
    };
  }
}
