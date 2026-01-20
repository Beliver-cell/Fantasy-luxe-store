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


export const sendOrderShippedEmail = async (email, orderId, trackingUrl) => {
  const htmlContent = `
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
      <div style='background-color: #000; color: white; padding: 20px; text-align: center;'>
        <h1>Fantasy Luxe</h1>
      </div>
      <div style='padding: 20px; background-color: #f9f9f9;'>
        <h2 style='color: #000;'>Your Order Has Shipped!</h2>
        <p>Good news! Your order ID: <strong>${orderId}</strong> is on its way.</p>
        
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
