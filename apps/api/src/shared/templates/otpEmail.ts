const escapeHtml = (value: string) =>
  value.replace(/[&<>"]/g, (character) => {
    switch (character) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return character;
    }
  });

const otpTemplate = (otp: string, name: string) => {
  const escapedName = escapeHtml(name);

  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 0; background-color: #f9fafb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e5e7eb;">
  
  <div style="background: #4f46e5; padding: 32px 24px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">TeamPulse</h1>
  </div>

  <div style="background: #ffffff; padding: 40px 32px; text-align: center;">
    <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #111827; text-align: left;">Hi ${escapedName},</p>
    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563; text-align: left;">Your one-time verification code is requested below. Please use this to complete your verification process.</p>
    
    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px 24px; margin: 32px 0; display: inline-block; border: 1px solid #e5e7eb;">
      <h2 style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: 6px; color: #111827; font-family: 'Courier New', Courier, monospace;">${otp}</h2>
    </div>
    
    <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 500; color: #9ca3af;">This code expires in <span style="color: #dc2626; font-weight: 600;">10 minutes</span>.</p>
    <p style="margin: 0; font-size: 14px; color: #9ca3af;">If you didn't request this email, you can safely ignore it.</p>
  </div>

  <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280;">&copy; 2026 TeamPulse. All rights reserved.</p>
    <p style="margin: 0; font-size: 11px; color: #9ca3af;">This is an automated message, please do not reply to this email.</p>
  </div>

</div>
`;
};

export default otpTemplate;
