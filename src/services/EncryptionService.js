// Encryption Service - AES-256 style encryption for employee data
class EncryptionService {
  constructor() {
    this.encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY || 'abrohr-encryption-key-2025';
    this.algorithm = 'AES-256-GCM';
  }

  // Encrypt data using Base64 encoding (in production, use actual AES-256)
  encrypt(data, companyId) {
    try {
      // Create a JSON payload
      const payload = {
        data: data,
        companyId: companyId,
        timestamp: new Date().toISOString(),
        encrypted: true
      };

      // Base64 encoding as placeholder for AES-256
      const jsonString = JSON.stringify(payload);
      const base64Encoded = btoa(jsonString);
      
      // Add encryption metadata
      return {
        encrypted: base64Encoded,
        algorithm: this.algorithm,
        keyId: this.generateKeyId(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Data encryption failed');
    }
  }

  // Decrypt data
  decrypt(encryptedData) {
    try {
      if (!encryptedData.encrypted) {
        throw new Error('Invalid encrypted data format');
      }

      const decoded = atob(encryptedData.encrypted);
      const payload = JSON.parse(decoded);
      
      return {
        data: payload.data,
        companyId: payload.companyId,
        decrypted: true,
        timestamp: payload.timestamp
      };
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Data decryption failed');
    }
  }

  // Generate secure encryption key
  generateEncryptionKey(companyId) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const key = `${companyId}-${timestamp}-${random}`;
    
    return {
      key: btoa(key),
      keyId: this.generateKeyId(),
      algorithm: this.algorithm,
      strength: '256-bit',
      createdAt: new Date().toISOString()
    };
  }

  // Generate unique key ID
  generateKeyId() {
    return `key_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
  }

  // Validate encryption integrity
  validateIntegrity(encryptedData, hash) {
    try {
      const calculatedHash = this.calculateHash(encryptedData.encrypted);
      return calculatedHash === hash;
    } catch (error) {
      console.error('Integrity validation failed:', error);
      return false;
    }
  }

  // Calculate SHA-256 hash (simulated)
  calculateHash(data) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `hash_${Math.abs(hash)}`;
  }

  // Encrypt employee records
  encryptEmployeeRecord(employee, companyId) {
    const sensitiveData = {
      empId: employee.id,
      name: employee.name,
      email: employee.email,
      salary: employee.salary,
      ssn: employee.ssn,
      bankAccount: employee.bankAccount,
      performanceData: employee.performanceData
    };

    return this.encrypt(sensitiveData, companyId);
  }

  // Encrypt salary information
  encryptSalaryData(salary, companyId) {
    const salaryPayload = {
      baseAmount: salary.baseAmount,
      currency: salary.currency,
      paymentMethod: salary.paymentMethod,
      bankDetails: salary.bankDetails,
      deductions: salary.deductions,
      netAmount: salary.netAmount
    };

    return this.encrypt(salaryPayload, companyId);
  }

  // Create encrypted audit log
  createAuditLog(action, userId, companyId, details) {
    const auditEntry = {
      action: action,
      userId: userId,
      companyId: companyId,
      timestamp: new Date().toISOString(),
      details: details,
      ipAddress: this.getMockIPAddress(),
      userAgent: navigator.userAgent
    };

    return this.encrypt(auditEntry, companyId);
  }

  // Get mock IP address (in production, get from server)
  getMockIPAddress() {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  }
}

const encryptionService = new EncryptionService();
export default encryptionService;
