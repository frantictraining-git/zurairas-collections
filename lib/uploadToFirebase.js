import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a file to Firebase Storage with progress tracking.
 * @param {File} file - The (compressed) file to upload
 * @param {Function} onProgress - Optional callback receiving 0-100 progress
 * @returns {Promise<string>} - Resolves to the public download URL
 */
export function uploadToFirebase(file, onProgress) {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop() || 'webp';
    const fileName = `products/${uuidv4()}.${ext}`;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const pct = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) onProgress(pct);
      },
      (error) => {
        console.error('Firebase upload error:', error.code, error.message);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}
