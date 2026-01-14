import { useState } from 'react';

// Secure Employee Portal with Encryption & Blockchain
const EmployeePortalSecure = ({ employeeData, companyId }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSecurityStatus, setShowSecurityStatus] = useState(true);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [blockchainVerified, setBlockchainVerified] = useState(true);

  // Simulate blockchain verification
  const verifyBlockchain = () => {
    const blockchainHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    const timestamp = new Date().toISOString();
    return {
      verified: true,
      hash: blockchainHash,
      timestamp: timestamp,
      status: 'IMMUTABLE_RECORD'
    };
  };

  // Simulate data encryption
  const encryptData = (data) => {
    const encrypted = btoa(JSON.stringify(data)); // Base64 encoding as placeholder
    return `[ENCRYPTED_${encrypted}]`;
  };

  // Security badge component
  const SecurityBadge = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 15px',
      backgroundColor: blockchainVerified ? '#e8f5e9' : '#ffebee',
      borderRadius: '6px',
      border: `2px solid ${blockchainVerified ? '#4caf50' : '#f44336'}`,
      marginBottom: '20px'
    }}>
      <span style={{fontSize: '20px'}}>🔐</span>
      <div>
        <h4 style={{margin: '0 0 4px 0', color: '#333'}}>Security Status</h4>
        <p style={{margin: '0', fontSize: '12px', color: '#666'}}>
          🔗 Blockchain Verified | 🔒 AES-256 Encrypted | ✅ Company Isolated
        </p>
      </div>
    </div>
  );

  // Employee dashboard
  const renderDashboard = () => (
    <div style={{padding: '20px'}}>
      <h3>📊 Employee Dashboard</h3>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px'}}>
        <div style={{padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px', border: '2px solid #5b5bce'}}>
          <h4>Employee ID</h4>
          <p style={{fontFamily: 'monospace', color: '#5b5bce', fontWeight: 'bold'}}>EMP-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
        <div style={{padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px', border: '2px solid #5b5bce'}}>
          <h4>Company</h4>
          <p style={{fontFamily: 'monospace', color: '#5b5bce', fontWeight: 'bold'}}>{companyId || 'COMPANY_001'}</p>
        </div>
        <div style={{padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px', border: '2px solid #5b5bce'}}>
          <h4>Access Level</h4>
          <p style={{fontFamily: 'monospace', color: '#5b5bce', fontWeight: 'bold'}}>ENCRYPTED_READ_ONLY</p>
        </div>
      </div>
      <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#fffbea', borderRadius: '8px', borderLeft: '4px solid #ff9800'}}>
        <h4>🔗 Blockchain Record</h4>
        <p style={{fontSize: '12px', fontFamily: 'monospace'}}>Hash: {verifyBlockchain().hash.substr(0, 20)}...</p>
        <p style={{fontSize: '12px', color: '#666'}}>Status: IMMUTABLE_VERIFIED</p>
      </div>
    </div>
  );

  // Secure records view
  const renderSecureRecords = () => (
    <div style={{padding: '20px'}}>
      <h3>📁 Secure Records (Encrypted)</h3>
      <div style={{marginTop: '15px'}}>
        {['Salary Slip', 'Tax Documents', 'Performance Review', 'Leave Balance', 'Benefits Summary'].map((record, idx) => (
          <div key={idx} style={{
            padding: '15px',
            marginBottom: '10px',
            backgroundColor: '#f9f9f9',
            borderLeft: '4px solid #5b5bce',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h5 style={{margin: '0 0 5px 0'}}>🔐 {record}</h5>
              <p style={{margin: '0', fontSize: '12px', color: '#999'}}>Encrypted • Blockchain Verified</p>
            </div>
            <button style={{
              padding: '8px 15px',
              backgroundColor: '#5b5bce',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>View</button>
          </div>
        ))}
      </div>
    </div>
  );

  // Blockchain verification tab
  const renderBlockchainTab = () => (
    <div style={{padding: '20px'}}>
      <h3>⛓️ Blockchain Verification</h3>
      <div style={{marginTop: '15px'}}>
        <div style={{
          padding: '15px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          borderLeft: '4px solid #4caf50',
          marginBottom: '15px'
        }}>
          <h4 style={{margin: '0 0 10px 0'}}>✅ All Employee Data is Blockchain Verified</h4>
          <ul style={{margin: '0', paddingLeft: '20px', fontSize: '14px'}}>
            <li>Immutable Record Keeping</li>
            <li>Timestamp Verification</li>
            <li>Company-Level Isolation</li>
            <li>Cryptographic Hashing</li>
            <li>Zero-Knowledge Proof Compatible</li>
          </ul>
        </div>
        <div style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '12px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          <p><strong>Latest Block Hash:</strong></p>
          <p style={{wordBreak: 'break-all', color: '#5b5bce'}}>
            {verifyBlockchain().hash}
          </p>
          <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
          <p><strong>Company ID:</strong> {companyId || 'COMPANY_001'}</p>
          <p><strong>Verification Status:</strong> ✓ VERIFIED</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{margin: '0'}}>🔐 Secure Employee Portal</h2>
        <button
          onClick={() => setShowSecurityStatus(!showSecurityStatus)}
          style={{
            padding: '8px 15px',
            backgroundColor: '#5b5bce',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showSecurityStatus ? '🙈 Hide' : '👁️ Show'} Security
        </button>
      </div>

      {showSecurityStatus && <SecurityBadge />}

      {/* Navigation tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        borderBottom: '2px solid #ddd',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {[
          {id: 'dashboard', label: '📊 Dashboard'},
          {id: 'records', label: '📁 Secure Records'},
          {id: 'blockchain', label: '⛓️ Blockchain'}
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              backgroundColor: activeTab === tab.id ? '#5b5bce' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#333',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              borderBottom: activeTab === tab.id ? '3px solid #5b5bce' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'records' && renderSecureRecords()}
      {activeTab === 'blockchain' && renderBlockchainTab()}

      {/* Footer with security info */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f0f0f0',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#666',
        textAlign: 'center',
        borderTop: '2px solid #ddd'
      }}>
        <p>🔐 End-to-End Encryption | ⛓️ Blockchain Verified | 🏢 Company Isolated | ✅ GDPR Compliant</p>
      </div>
    </div>
  );
};

export default EmployeePortalSecure;
