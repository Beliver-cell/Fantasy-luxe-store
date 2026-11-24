import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import ENV from './serverConfig.js';

// Initialize Resend if API key exists
const resend = ENV.RESEND_API_KEY 
  ? new Resend(ENV.RESEND_API_KEY)
  : null;

// Email sender address - use verified domain or fallback to Resend test domain
const SENDER_EMAIL = ENV.RESEND_FROM_EMAIL || 'Fantasy Luxe <noreply@fantasyluxe.store>';

// Create nodemailer transporter for Gmail/SMTP fallback
const createTransporter = () => {
  const emailUser = ENV.EMAIL_USER;
  const emailPass = ENV.EMAIL_PASS;
  const emailHost = ENV.EMAIL_HOST;
  const emailPort = ENV.EMAIL_PORT;
  
  if (!emailUser || !emailPass) {
    console.error('Email configuration missing: EMAIL_USER and EMAIL_PASSWORD/EMAIL_PASS required');
    return null;
  }
  
  const config = {
    auth: {
      user: emailUser,
      pass: emailPass
    }
  };
  
  if (emailHost && emailPort) {
    config.host = emailHost;
    config.port = parseInt(emailPort);
    config.secure = emailPort === '465';
  } else {
    config.service = 'gmail';
  }
  
  return nodemailer.createTransport(config);
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendVerificationOTP = async (email, otp) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #000; color: white; padding: 20px; text-align: center;">
        <h1>Fantasy Luxe</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9;">
        <h2>Welcome to Fantasy Luxe!</h2>
        <p>Thank you for signing up. Please use the verification code below to activate your account:</p>
        <div style="background-color: #000; color: white; padding: 30px; text-align: center; margin: 30px 0; border-radius: 10px;">
          <h1 style="margin: 0; font-size: 48px; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="color: #666;">This code will expire in 10 minutes.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          If you didn't sign up for Fantasy Luxe, please ignore this email.
        </p>
      </div>
      <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #999;">
        <p>© 2025 Fantasy Luxe. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    // Try Resend first if configured
    if (resend) {
      const { data, error } = await resend.emails.send({
        from: SENDER_EMAIL,
        to: email,
        subject: 'Your Fantasy Luxe Verification Code',
        html: htmlContent
      });

      if (error) {
        console.error('Resend error:', error);
        throw new Error(error.message);
      }

      console.log('Verification email sent via Resend to:', email);
      return true;
    }

    // Fallback to nodemailer (Gmail/SMTP)
    const transporter = createTransporter();
    if (!transporter) {
      console.error('Email transporter not configured');
      return false;
    }
    
    await transporter.sendMail({
      from: ENV.EMAIL_USER,
      to: email,
      subject: 'Your Fantasy Luxe Verification Code',
      html: htmlContent
    });
    console.log('Verification email sent via SMTP to:', email);
    return true;
  } catch (error) {
    console.error('Email error:', error.message);
    return false;
  }
};

export const sendResetPasswordOTP = async (email, otp) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #000; color: white; padding: 20px; text-align: center;">
        <h1>Fantasy Luxe</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9;">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Please use the code below:</p>
        <div style="background-color: #000; color: white; padding: 30px; text-align: center; margin: 30px 0; border-radius: 10px;">
          <h1 style="margin: 0; font-size: 48px; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="color: #666;">This code will expire in 10 minutes.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          If you didn't request this, please ignore this email.
        </p>
      </div>
      <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #999;">
        <p>© 2025 Fantasy Luxe. All rights reserved.</p>
      </div>
    </div>
  `;

  // 1. Try Resend first if configured
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: SENDER_EMAIL,
        to: email,
        subject: 'Your Fantasy Luxe Password Reset Code',
        html: htmlContent
      });

      if (!error) {
        console.log('Password reset email sent via Resend to:', email);
        return true;
      }
      console.warn('Resend failed for reset password, attempting SMTP fallback:', error.message || error);
    } catch (resendError) {
      console.warn('Resend error for reset password, attempting SMTP fallback:', resendError.message);
    }
  }

  // 2. Fallback to nodemailer (Gmail/SMTP)
  try {
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: ENV.EMAIL_USER,
        to: email,
        subject: 'Your Fantasy Luxe Password Reset Code',
        html: htmlContent
      });
      console.log('Password reset email sent via SMTP to:', email);
      return true;
    }
  } catch (smtpError) {
    console.error('SMTP error for reset password:', smtpError.message);
  }

  // 3. Dev mode fallback logging
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEV OTP NOTIFICATION] User password reset OTP for ${email}: ${otp}`);
    return true;
  }

  return false;
};

export const sendAdminResetPasswordOTP = async (email, otp) => {
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #111827 0%, #000000 100%); color: #ffffff; padding: 32px 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Fantasy Luxe</h1>
        <p style="margin: 8px 0 0; font-size: 13px; color: #9ca3af; letter-spacing: 1.5px; text-transform: uppercase;">Administrator Security Portal</p>
      </div>
      <div style="padding: 32px 24px; background-color: #ffffff;">
        <h2 style="margin: 0 0 16px; font-size: 20px; color: #111827; font-weight: 600;">Admin Password Reset Request</h2>
        <p style="margin: 0 0 16px; color: #4b5563; font-size: 15px; line-height: 1.6;">
          We received a request to reset the password for your Fantasy Luxe Administrator account (<strong style="color: #111827;">${email}</strong>).
        </p>
        <p style="margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.6;">
          Use the 6-digit verification code below to authorize your password reset:
        </p>
        <div style="background-color: #0f172a; color: #ffffff; padding: 24px; text-align: center; margin: 24px 0; border-radius: 8px;">
          <div style="font-size: 40px; font-weight: 700; letter-spacing: 8px; font-family: monospace;">${otp}</div>
          <p style="margin: 8px 0 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">One-Time Security Code</p>
        </div>
        <p style="color: #dc2626; font-size: 13px; font-weight: 500; margin: 16px 0 8px;">
          ⏱ This code will expire in 10 minutes.
        </p>
        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; margin-top: 20px; border-radius: 4px;">
          <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.5;">
            <strong>Security Alert:</strong> If you did not initiate this password reset, someone may be attempting to access your admin account. Please secure your account immediately.
          </p>
        </div>
      </div>
      <div style="background-color: #f9fafb; padding: 20px 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0 0 4px;">© ${new Date().getFullYear()} Fantasy Luxe. All rights reserved.</p>
        <p style="margin: 0; color: #9ca3af;">This is an automated administrative notification. Do not reply to this email.</p>
      </div>
    </div>
  `;

  // 1. Try Resend first if configured
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: SENDER_EMAIL,
        to: email,
        subject: 'Fantasy Luxe Admin - Password Reset Verification Code',
        html: htmlContent
      });

      if (!error) {
        console.log('Admin password reset email sent via Resend to:', email);
        return true;
      }
      console.warn('Resend failed for admin reset password, attempting SMTP fallback:', error.message || error);
    } catch (resendError) {
      console.warn('Resend error for admin reset password, attempting SMTP fallback:', resendError.message);
    }
  }

  // 2. Fallback to nodemailer (Gmail/SMTP)
  try {
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: ENV.EMAIL_USER,
        to: email,
        subject: 'Fantasy Luxe Admin - Password Reset Verification Code',
        html: htmlContent
      });
      console.log('Admin password reset email sent via SMTP to:', email);
      return true;
    }
  } catch (smtpError) {
    console.error('SMTP error for admin reset password:', smtpError.message);
  }

  // 3. Dev mode fallback logging
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEV OTP NOTIFICATION] Admin password reset OTP for ${email}: ${otp}`);
    return true;
  }

  return false;
};

export const sendSubscriptionConfirmation = async (email) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #000; color: white; padding: 20px; text-align: center;">
        <h1>Fantasy Luxe</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9;">
        <h2>Thanks for Subscribing!</h2>
        <p>Welcome to the Fantasy Luxe family! We're thrilled to have you.</p>
        <p>As a subscriber, you'll be the first to know about:</p>
        <ul style="color: #666; line-height: 1.8;">
          <li>Exclusive new arrivals</li>
          <li>Special discounts and promotions</li>
          <li>Early access to sales</li>
          <li>Fashion tips and style inspiration</li>
        </ul>
        <div style="background-color: #000; color: white; padding: 20px; text-align: center; margin: 30px 0; border-radius: 10px;">
          <p style="margin: 0; font-size: 18px;">Enjoy 20% off your first order!</p>
          <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold; letter-spacing: 3px;">WELCOME20</p>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          If you didn't subscribe to Fantasy Luxe, you can safely ignore this email.
        </p>
      </div>
      <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #999;">
        <p>© 2025 Fantasy Luxe. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    if (resend) {
      const { data, error } = await resend.emails.send({
        from: SENDER_EMAIL,
        to: email,
        subject: 'Thanks for Subscribing to Fantasy Luxe!',
        html: htmlContent
      });

      if (error) {
        console.error('Resend subscription email error:', error);
        return false;
      }

      console.log('Subscription confirmation sent via Resend to:', email);
      return true;
    }

    const transporter = createTransporter();
    if (!transporter) {
      console.error('Email transporter not configured');
      return false;
    }
    
    await transporter.sendMail({
      from: ENV.EMAIL_USER,
      to: email,
      subject: 'Thanks for Subscribing to Fantasy Luxe!',
      html: htmlContent
    });
    console.log('Subscription confirmation sent via SMTP to:', email);
    return true;
  } catch (error) {
    console.error('Subscription email error:', error.message);
    return false;
  }
};


export const sendOrderPlacedEmail = async (email, orderId, amount, paymentLink, deliveryInfo) => {
  const dispatchDays = deliveryInfo?.dispatchDays || "WEDNESDAYS and SATURDAYS";
  const deliveryTime = deliveryInfo?.deliveryTime || "1-3 working days";
  
  const htmlContent = `
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
      <div style='background-color: #000; color: white; padding: 20px; text-align: center;'>
        <h1>Fantasy Luxe</h1>
      </div>
      <div style='padding: 20px; background-color: #f9f9f9;'>
        <h2>Order Received!</h2>
        <p>Thank you for placing your order. Order ID: <strong>${orderId}</strong></p>
        <p>Total Amount: <strong>${ENV.CURRENCY} ${amount}</strong></p>
        <p>Your order is currently pending payment. Please complete your payment to finalize the order.</p>
        
        <div style='text-align: center; margin: 30px 0;'>
          <a href='${paymentLink}' style='background-color: #000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Complete Payment</a>
        </div>

        <p style='color: #666; margin-top: 20px;'>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style='color: #0066cc; word-break: break-all;'>${paymentLink}</p>
        
        <div style='background-color: #fff; padding: 15px; margin-top: 20px; border-radius: 5px; border: 1px solid #eee;'>
          <h3 style='margin-top: 0;'>Delivery Information</h3>
          <ul style='color: #666; padding-left: 20px; text-align: left;'>
            <li>Orders are dispatched on <strong>${dispatchDays}</strong>.</li>
            <li>Delivery takes <strong>${deliveryTime}</strong> after dispatch.</li>
          </ul>
        </div>
      </div>
      <div style='background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #999;'>
        <p>© 2025 Fantasy Luxe. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    if (resend) {
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: email,
        subject: 'Order Received - Pending Payment #' + orderId,
        html: htmlContent
      });
      console.log('Order placed email sent via Resend to:', email);
      return true;
    }

    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: ENV.EMAIL_USER,
        to: email,
        subject: 'Order Received - Pending Payment #' + orderId,
        html: htmlContent
      });
      console.log('Order placed email sent via SMTP to:', email);
      return true;
    }
  } catch (error) {
    console.error('Order email error:', error.message);
  }
  return false;
};

export const sendPaymentSuccessEmail = async (email, orderId, amount, deliveryInfo) => {
  const dispatchDays = deliveryInfo?.dispatchDays || "WEDNESDAYS and SATURDAYS";
  const deliveryTime = deliveryInfo?.deliveryTime || "1-3 working days";

  const htmlContent = `
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
      <div style='background-color: #000; color: white; padding: 20px; text-align: center;'>
        <h1>Fantasy Luxe</h1>
      </div>
      <div style='padding: 20px; background-color: #f9f9f9;'>
        <h2 style='color: #008000;'>Payment Successful!</h2>
        <p>Your payment for Order ID: <strong>${orderId}</strong> has been confirmed.</p>
        <p>Amount Paid: <strong>${ENV.CURRENCY} ${amount}</strong></p>
        <p>We will prepare your order for shipping immediately.</p>
        
        <div style='background-color: #fff; padding: 15px; margin-top: 20px; border-radius: 5px; border: 1px solid #eee;'>
          <h3 style='margin-top: 0;'>Delivery Information</h3>
          <ul style='color: #666; padding-left: 20px; text-align: left;'>
            <li>Orders are dispatched on <strong>${dispatchDays}</strong>.</li>
            <li>Delivery takes <strong>${deliveryTime}</strong> after dispatch.</li>
            <li>You will receive another email when your order ships.</li>
          </ul>
        </div>
      </div>
      <div style='background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #999;'>
        <p>© 2025 Fantasy Luxe. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    if (resend) {
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: email,
        subject: 'Payment Confirmed - Order #' + orderId,
        html: htmlContent
      });
      console.log('Payment success email sent via Resend to:', email);
      return true;
    }

    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: ENV.EMAIL_USER,
        to: email,
        subject: 'Payment Confirmed - Order #' + orderId,
        html: htmlContent
      });
      console.log('Payment success email sent via SMTP to:', email);
      return true;
    }
  } catch (error) {
    console.error('Payment success email error:', error.message);
  }
  return false;
};


export const sendOrderShippedEmail = async (email, orderId, trackingUrl, shippingId, carrier) => {
  const htmlContent = `
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
      <div style='background-color: #000; color: white; padding: 20px; text-align: center;'>
        <h1>Fantasy Luxe</h1>
      </div>
      <div style='padding: 20px; background-color: #f9f9f9;'>
        <h2 style='color: #000;'>Your Order Has Shipped!</h2>
        <p>Good news! Your order ID: <strong>${orderId}</strong> is on its way.</p>
        
        <div style="background-color: #fff; padding: 15px; margin: 20px 0; border: 1px solid #ddd; border-radius: 5px;">
            ${carrier ? `<p style="margin: 5px 0;"><strong>Carrier:</strong> ${carrier}</p>` : ''}
            ${shippingId ? `<p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${shippingId}</p>` : ''}
        </div>

        ${trackingUrl ? `
        <div style='text-align: center; margin: 30px 0;'>
          <a href='${trackingUrl}' style='background-color: #000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Track Your Order</a>
        </div>
        <p style='color: #666; margin-top: 20px;'>Or copy this link:</p>
        <p style='color: #0066cc; word-break: break-all;'>${trackingUrl}</p>
        ` : ''}
        
        <p>Thank you for shopping with us!</p>
      </div>
      <div style='background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #999;'>
        <p>© 2025 Fantasy Luxe. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    if (resend) {
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: email,
        subject: 'Your Fantasy Luxe Order Has Shipped! #' + orderId,
        html: htmlContent
      });
      console.log('Order shipped email sent via Resend to:', email);
      return true;
    }

    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: ENV.EMAIL_USER,
        to: email,
        subject: 'Your Fantasy Luxe Order Has Shipped! #' + orderId,
        html: htmlContent
      });
      console.log('Order shipped email sent via SMTP to:', email);
      return true;
    }
  } catch (error) {
    console.error('Order shipped email error:', error.message);
  }
  return false;
};

export const sendOrderDeliveredEmail = async (email, orderId) => {
  const htmlContent = `
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
      <div style='background-color: #000; color: white; padding: 20px; text-align: center;'>
        <h1>Fantasy Luxe</h1>
      </div>
      <div style='padding: 20px; background-color: #f9f9f9;'>
        <h2 style='color: #008000;'>Order Delivered!</h2>
        <p>Your order ID: <strong>${orderId}</strong> has been marked as delivered.</p>
        <p>We hope you love your purchase!</p>
        
        <p style="margin-top: 30px;">If you haven't received it yet, please contact our support immediately.</p>
        
        <div style='text-align: center; margin: 30px 0;'>
            <a href='${ENV.FRONTEND_URL}/contact' style='display: inline-block; border: 1px solid #000; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Contact Support</a>
        </div>

        <p>Thank you for shopping with us!</p>
      </div>
      <div style='background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #999;'>
        <p>© 2025 Fantasy Luxe. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    if (resend) {
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: email,
        subject: 'Order Delivered! #' + orderId,
        html: htmlContent
      });
      console.log('Order delivered email sent via Resend to:', email);
      return true;
    }

    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: ENV.EMAIL_USER,
        to: email,
        subject: 'Order Delivered! #' + orderId,
        html: htmlContent
      });
      console.log('Order delivered email sent via SMTP to:', email);
      return true;
    }
  } catch (error) {
    console.error('Order delivered email error:', error.message);
  }
  return false;
};
