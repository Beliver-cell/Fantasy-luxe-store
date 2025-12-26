import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid if API key exists
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Create nodemailer transporter for Gmail/SMTP fallback
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS;
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = process.env.EMAIL_PORT;
  
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
    config.service = process.env.EMAIL_SERVICE || 'gmail';
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
    // Try SendGrid first if configured
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
      await sgMail.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Your Fantasy Luxe Verification Code',
        html: htmlContent
      });
      console.log('Verification email sent via SendGrid to:', email);
      return true;
    }

    // Fallback to nodemailer (Gmail/SMTP)
    const transporter = createTransporter();
    if (!transporter) {
      console.error('Email transporter not configured');
      return false;
    }
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
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
    // Try SendGrid first if configured
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
      await sgMail.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Your Fantasy Luxe Password Reset Code',
        html: htmlContent
      });
      console.log('Password reset email sent via SendGrid to:', email);
      return true;
    }

    // Fallback to nodemailer (Gmail/SMTP)
    const transporter = createTransporter();
    if (!transporter) {
      console.error('Email transporter not configured');
      return false;
    }
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
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
