import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_APP_SECRET_KEY; 

export const CryptoHelper = {
  encrypt: (plainText: string | number): string => {
    try {
      const ciphertext = CryptoJS.AES.encrypt(plainText?.toString(), SECRET_KEY).toString();
      return ciphertext;
    } catch (error) {
      console.error('Encryption failed:', error);
      return '';
    }
  },

  decrypt: (cipherText: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!originalText) throw new Error('Invalid Secret Key or Corrupted Data');
      
      return originalText;
    } catch (error) {
      console.error('Decryption failed:', error);
      return 'ถอดรหัสไม่สำเร็จ';
    }
  }
};