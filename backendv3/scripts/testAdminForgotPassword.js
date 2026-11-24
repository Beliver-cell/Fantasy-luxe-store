import userRouter from '../routes/userRoute.js';
import { 
  forgotPasswordAdmin, 
  resetPasswordAdmin, 
  resendAdminResetOTP 
} from '../controllers/userController.js';
import { sendAdminResetPasswordOTP } from '../config/email.js';

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
  console.log('\n--- 1. Testing Route Registration in userRouter ---');
  const registeredRoutes = userRouter.stack
    .filter(r => r.route)
    .map(r => ({
      path: r.route.path,
      methods: Object.keys(r.route.methods)
    }));

  const forgotRoute = registeredRoutes.find(r => r.path === '/admin/forgot-password');
  assert(forgotRoute && forgotRoute.methods.includes('post'), 'POST /admin/forgot-password is registered');

  const resetRoute = registeredRoutes.find(r => r.path === '/admin/reset-password');
  assert(resetRoute && resetRoute.methods.includes('post'), 'POST /admin/reset-password is registered');

  const resendRoute = registeredRoutes.find(r => r.path === '/admin/resend-reset-otp');
  assert(resendRoute && resendRoute.methods.includes('post'), 'POST /admin/resend-reset-otp is registered');

  console.log('\n--- 2. Testing Controller Validation Logic ---');

  // Test forgotPasswordAdmin with invalid email
  let req = { body: { email: 'not-an-email' } };
  let resJson = null;
  let res = { json: (data) => { resJson = data; } };
  await forgotPasswordAdmin(req, res);
  assert(resJson && resJson.success === false && resJson.message.includes('valid email'), 
    'forgotPasswordAdmin rejects invalid email');

  // Test forgotPasswordAdmin with empty body
  req = { body: {} };
  resJson = null;
  await forgotPasswordAdmin(req, res);
  assert(resJson && resJson.success === false, 
    'forgotPasswordAdmin rejects empty body');

  // Test resetPasswordAdmin with missing fields
  req = { body: { otp: '123456' } };
  resJson = null;
  await resetPasswordAdmin(req, res);
  assert(resJson && resJson.success === false && resJson.message.includes('required'), 
    'resetPasswordAdmin rejects missing newPassword/email/userId');

  // Test resetPasswordAdmin with short password
  req = { body: { email: 'admin@fantasyluxe.store', otp: '123456', newPassword: '123' } };
  resJson = null;
  await resetPasswordAdmin(req, res);
  assert(resJson && resJson.success === false && resJson.message.includes('8 characters'), 
    'resetPasswordAdmin rejects password shorter than 8 characters');

  // Test resendAdminResetOTP with missing identifiers
  req = { body: {} };
  resJson = null;
  await resendAdminResetOTP(req, res);
  assert(resJson && resJson.success === false && resJson.message.includes('required'), 
    'resendAdminResetOTP rejects request without email or userId');

  console.log('\n--- 3. Testing Email Functionality ---');
  assert(typeof sendAdminResetPasswordOTP === 'function', 
    'sendAdminResetPasswordOTP is exported and callable');

  const testEmailResult = await sendAdminResetPasswordOTP('admin-test@fantasyluxe.store', '123456');
  assert(typeof testEmailResult === 'boolean', 
    `sendAdminResetPasswordOTP executed and returned boolean (${testEmailResult})`);

  console.log(`\n========================================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test suite failed with unexpected error:', err);
  process.exit(1);
});
