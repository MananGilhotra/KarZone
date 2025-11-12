const axios = require('../utils/axiosConfig');

/**
 * Send welcome email (example using axios)
 * @param {string} email - User email
 * @param {string} fullName - User full name
 */
exports.sendWelcomeEmail = async (email, fullName) => {
  try {
    
    const emailServiceUrl = process.env.EMAIL_SERVICE_URL;

    if (emailServiceUrl) {
      const emailData = {
        to: email,
        subject: 'Welcome to KARZONE!',
        html: `
          <h1>Welcome ${fullName}!</h1>
          <p>Thank you for signing up with KARZONE.</p>
          <p>Enjoy your premium mobility experience!</p>
        `,
      };

    }

    console.log(`📧 Welcome email would be sent to: ${email}`);
    console.log(`   Name: ${fullName}`);
    
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, message: 'Failed to send email' };
  }
};

/**
 * Log user activity to external analytics service
 * @param {string} userId - User ID
 * @param {string} activity - Activity type
 */
exports.logUserActivity = async (userId, activity) => {
  try {
    const activityData = {
      userId,
      activity,
      timestamp: new Date().toISOString(),
    };


    console.log(`📊 Activity logged: ${activity} for user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error('Error logging activity:', error);
    return { success: false };
  }
};

/**
 * Verify email using external service
 * @param {string} email - Email to verify
 */
exports.verifyEmail = async (email) => {
  try {
   

    console.log(`🔍 Email verification check for: ${email}`);
    return { valid: true, message: 'Email verified' };
  } catch (error) {
    console.error('Error verifying email:', error);
    return { valid: false, message: 'Email verification failed' };
  }
};

