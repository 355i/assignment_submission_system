// utils/cleanFiles.js
import { unlinkSync } from 'fs';
import path from 'path';

function cleanupFiles(req) {
  const files = req.files || {};
  Object.values(files).flat().forEach(file => {
    try {
      unlinkSync(file.path);
    } catch (err) {
      console.warn(`Failed to delete temp file: ${file.path}`, err);
    }
  });
}

export default cleanupFiles;
