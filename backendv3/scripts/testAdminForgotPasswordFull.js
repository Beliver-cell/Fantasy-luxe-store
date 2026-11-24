import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { 
  forgotPasswordAdmin, 
  resetPasswordAdmin, 
  resendAdminResetOTP 
} from '../controllers/userController.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- 4. Testing End-to-End Forgot & Reset Password Flow with Mock DB ---');

  // Create a mock admin user in memory
  const initialPassword = 'OldPassword123!';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(initialPassword, salt);

  const mockAdmin = {
    _id: '65f1234567890123456789ab',
    name: 'Main Admin',
    email: 'admin@fantasyluxe.store',
    password: hashedPassword,
    role: 'admin',
    isVerified: true,
    resetPasswordOTP: null,
    resetPasswordOTPExpire: null,
    save: async function() { return this; }
  };

  // Mock userModel.findOne
  const originalFindOne = userModel.findOne;
  userModel.findOne = async (query) => {
    if (query.role === 'admin') {
      if (query.email && query.email.toLowerCase() === mockAdmin.email) {
        return mockAdmin;
      }
      if (query._id && query._id === mockAdmin._id) {
        return mockAdmin;
      }
    }
    return null;
  };

  try {
    // 1. Request forgot password for non-existent admin
    let req = { body: { email: 'nonexistent@fantasyluxe.store' } };
    let resData = null;
    let res = { json: (data) => { resData = data; } };
    await forgotPasswordAdmin(req, res);
    assert(resData.success === false && resData.message.includes('not found'), 
      'Rejects non-existent admin email');

    // 2. Request forgot password for valid admin
    req = { body: { email: 'admin@fantasyluxe.store' } };
    resData = null;
    await forgotPasswordAdmin(req, res);
    assert(resData.success === true && resData.userId === mockAdmin._id, 
      'Sends reset OTP for valid admin and returns userId');
    assert(mockAdmin.resetPasswordOTP && mockAdmin.resetPasswordOTP.length === 6, 
      `Generated 6-digit OTP on admin object: ${mockAdmin.resetPasswordOTP}`);
    assert(mockAdmin.resetPasswordOTPExpire && mockAdmin.resetPasswordOTPExpire > new Date(), 
      'OTP expiration date set into the future (10 minutes)');

    const generatedOTP = mockAdmin.resetPasswordOTP;

    // 3. Attempt reset with WRONG OTP
    req = { 
      body: { 
        email: 'admin@fantasyluxe.store', 
        otp: '000000', 
        newPassword: 'BrandNewSecurePassword2026!' 
      } 
    };
    resData = null;
    await resetPasswordAdmin(req, res);
    assert(resData.success === false && resData.message.includes('Invalid'), 
      'Rejects reset attempt with invalid OTP');

    // 4. Attempt reset with EXPIRED OTP
    mockAdmin.resetPasswordOTPExpire = new Date(Date.now() - 1000); // in the past
    req = { 
      body: { 
        email: 'admin@fantasyluxe.store', 
        otp: generatedOTP, 
        newPassword: 'BrandNewSecurePassword2026!' 
      } 
    };
    resData = null;
    await resetPasswordAdmin(req, res);
    assert(resData.success === false && resData.message.includes('expired'), 
      'Rejects reset attempt with expired OTP');

    // 5. Test Resending OTP
    req = { body: { email: 'admin@fantasyluxe.store' } };
    resData = null;
    await resendAdminResetOTP(req, res);
    assert(resData.success === true, 'Resends reset OTP successfully');
    assert(mockAdmin.resetPasswordOTPExpire > new Date(), 'New OTP has fresh expiration');
    const newOTP = mockAdmin.resetPasswordOTP;

    // 6. Reset with VALID OTP and NEW password
    const newPassword = 'BrandNewSecurePassword2026!';
    req = { 
      body: { 
        userId: mockAdmin._id,
        email: 'admin@fantasyluxe.store', 
        otp: newOTP, 
        newPassword: newPassword 
      } 
    };
    resData = null;
    await resetPasswordAdmin(req, res);
    assert(resData.success === true && resData.token, 
      'Reset password succeeded and returned admin auth token');
    assert(mockAdmin.resetPasswordOTP === null, 
      'resetPasswordOTP cleared after successful reset');
    assert(mockAdmin.resetPasswordOTPExpire === null, 
      'resetPasswordOTPExpire cleared after successful reset');

    // Verify new password hashes correctly
    const isNewPasswordValid = await bcrypt.compare(newPassword, mockAdmin.password);
    assert(isNewPasswordValid === true, 
      'New password was hashed with bcrypt and matches');

    const isOldPasswordInvalid = await bcrypt.compare(initialPassword, mockAdmin.password);
    assert(isOldPasswordInvalid === false, 
      'Old password no longer matches');

  } finally {
    userModel.findOne = originalFindOne;
  }

  console.log(`\n========================================`);
  console.log(`End-to-End Flow: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
