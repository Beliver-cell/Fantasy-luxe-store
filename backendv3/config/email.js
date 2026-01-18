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

  try {
    // Try Resend first if configured
    if (resend) {
      const { data, error } = await resend.emails.send({
        from: SENDER_EMAIL,
        to: email,
        subject: 'Your Fantasy Luxe Password Reset Code',
        html: htmlContent
      });

      if (error) {
        console.error('Resend error:', error);
        throw new Error(error.message);
      }

      console.log('Password reset email sent via Resend to:', email);
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
      subject: 'Your Fantasy Luxe Password Reset Code',
      html: htmlContent
    });
    console.log('Password reset email sent via SMTP to:', email);
    return true;
  } catch (error) {
    console.error('Email error:', error.message);
    return false;
  }
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

