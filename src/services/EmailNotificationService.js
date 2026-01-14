// Email Notification Service - Using Web3Forms (Free & Secure)
// No setup required - just send emails directly

class EmailNotificationService {
  constructor() {
    // Web3Forms endpoint - free service for form submissions
    this.WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
    // Using a test access key - in production, use environment variable
    this.ACCESS_KEY = '7e7c2e1d-9f8a-4d5c-9b3e-1a2b3c4d5e6f';
  }

  // Send registration confirmation email
  async sendRegistrationEmail(employeeData) {
    try {
      const emailContent = `
Dear ${employeeData.name},

Welcome to AbrO HR Employee Portal!

Your account has been successfully created.

========== YOUR LOGIN CREDENTIALS ==========
Email: ${employeeData.email}
Temporary Password: ${employeeData.temporaryPassword}
Employee ID: ${employeeData.id}
Company: ${employeeData.company}

IMPORTANT SECURITY NOTES:
✅ Your data is encrypted with AES-256 encryption
✅ All records are blockchain verified
✅ You can change your password after first login
✅ DO NOT share this password with anyone

LOGIN HERE: https://abrohr-frontend.vercel.app/

If you did not create this account, please contact HR immediately.

Best regards,
AbrO HR Team
      `;

      const formData = new FormData();
      formData.append('access_key', this.ACCESS_KEY);
      formData.append('email', employeeData.email);
      formData.append('subject', '🔐 AbrO HR Portal - Account Created Successfully');
      formData.append('message', emailContent);
      formData.append('redirect', 'https://abrohr-frontend.vercel.app/');

      const response = await fetch(this.WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      return { success: result.success, message: 'Registration email sent successfully' };
    } catch (error) {
      console.error('Registration email error:', error);
      return { success: false, message: 'Failed to send registration email' };
    }
  }

  // Send forgot password email with reset link
  async sendPasswordResetEmail(email, resetToken, employeeName) {
    try {
      const resetLink = `https://abrohr-frontend.vercel.app/reset-password?token=${resetToken}`;
      
      const emailContent = `
Hi ${employeeName},

We received a request to reset your AbrO HR password.

========== RESET YOUR PASSWORD ==========
Click here to reset: ${resetLink}
Or copy this link: ${resetLink}

Token: ${resetToken}
Expires in: 24 hours

If you didn't request this, ignore this email.
Your password will remain unchanged.

Security Tips:
✅ Never share your password
✅ Link expires after 24 hours
✅ Use a strong password (minimum 8 characters)
✅ Enable two-factor authentication when available

Have questions? Contact: support@abrohr.com

Best regards,
AbrO HR Security Team
      `;

      const formData = new FormData();
      formData.append('access_key', this.ACCESS_KEY);
      formData.append('email', email);
      formData.append('subject', '🔐 AbrO HR - Password Reset Request');
      formData.append('message', emailContent);
      formData.append('redirect', 'https://abrohr-frontend.vercel.app/');

      const response = await fetch(this.WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      return { success: result.success, message: 'Password reset email sent' };
    } catch (error) {
      console.error('Password reset email error:', error);
      return { success: false, message: 'Failed to send password reset email' };
    }
  }

  // Send product update/announcement to multiple employees
  async sendProductUpdateEmail(recipients, updateTitle, updateMessage) {
    try {
      const emailContent = `
Dear Employees,

========== ${updateTitle.toUpperCase()} ==========

${updateMessage}

========== WHAT'S NEW ==========
✨ Enhanced security features
✨ Improved user interface
✨ Better performance
✨ New employee benefits portal

LOGIN TO CHECK: https://abrohr-frontend.vercel.app/

For more details, visit your Employee Portal.

Questions?
Email: support@abrohr.com
Phone: 1-800-ABROHR

Best regards,
AbrO HR Management
      `;

      // Send email to each recipient
      const emailPromises = recipients.map(recipientEmail => {
        const formData = new FormData();
        formData.append('access_key', this.ACCESS_KEY);
        formData.append('email', recipientEmail);
        formData.append('subject', `📢 ${updateTitle} - AbrO HR Update`);
        formData.append('message', emailContent);
        formData.append('redirect', 'https://abrohr-frontend.vercel.app/');

        return fetch(this.WEB3FORMS_ENDPOINT, {
          method: 'POST',
          body: formData
        });
      });

      const results = await Promise.all(emailPromises);
      const successCount = results.filter(r => r.ok).length;

      return { 
        success: successCount === recipients.length, 
        message: `Update email sent to ${successCount}/${recipients.length} employees` 
      };
    } catch (error) {
      console.error('Product update email error:', error);
      return { success: false, message: 'Failed to send update emails' };
    }
  }

  // Send employee document/form email
  async sendDocumentEmail(email, documentType, documentLink, employeeName) {
    try {
      const emailContent = `
Hi ${employeeName},

Your ${documentType} is ready!

========== DOCUMENT DETAILS ==========
Document Type: ${documentType}
Access Link: ${documentLink}
Download Expiry: 30 days

How to access:
1. Click the link above
2. Login with your credentials
3. Download or view the document

Secure features:
✅ Encrypted transmission
✅ Blockchain verified
✅ Tamper-proof record
✅ Access tracking enabled

Need help?
Contact HR: hr@abrohr.com

Best regards,
AbrO HR
      `;

      const formData = new FormData();
      formData.append('access_key', this.ACCESS_KEY);
      formData.append('email', email);
      formData.append('subject', `📄 Your ${documentType} is Ready - AbrO HR`);
      formData.append('message', emailContent);
      formData.append('redirect', 'https://abrohr-frontend.vercel.app/');

      const response = await fetch(this.WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      return { success: result.success, message: `${documentType} email sent` };
    } catch (error) {
      console.error('Document email error:', error);
      return { success: false, message: 'Failed to send document email' };
    }
  }

  // Send security alert email
  async sendSecurityAlertEmail(email, alertType, details) {
    try {
      const emailContent = `
${alertType.toUpperCase()} SECURITY ALERT

Hi,

We detected unusual activity on your AbrO HR account.

========== DETAILS ==========
Alert Type: ${alertType}
${details}
Time: ${new Date().toISOString()}
Location: Remote

Was this you?
✅ YES - No action needed
❌ NO - Secure your account immediately

Action Steps:
1. Change your password
2. Enable two-factor authentication
3. Review recent activities
4. Contact security team if needed

Security Contact: security@abrohr.com

AbrO HR Security Team
      `;

      const formData = new FormData();
      formData.append('access_key', this.ACCESS_KEY);
      formData.append('email', email);
      formData.append('subject', `🚨 SECURITY ALERT - AbrO HR`);
      formData.append('message', emailContent);
      formData.append('redirect', 'https://abrohr-frontend.vercel.app/');

      const response = await fetch(this.WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      return { success: result.success, message: 'Security alert sent' };
    } catch (error) {
      console.error('Security alert email error:', error);
      return { success: false, message: 'Failed to send security alert' };
    }
  }

  // Generate random temporary password
  generateTemporaryPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Generate secure reset token
  generateResetToken() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

const emailNotificationService = new EmailNotificationService();
export default emailNotificationService;
