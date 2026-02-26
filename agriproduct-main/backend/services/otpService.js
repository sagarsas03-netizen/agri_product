/**
 * OTP Service - Simulates OTP generation and in-memory storage
 * In production: replace with Twilio / 2Factor SMS integration
 */

const otpStore = new Map(); // phone -> { otp, expiresAt }
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const saveOTP = (phone, otp) => {
    otpStore.set(phone, {
        otp,
        expiresAt: Date.now() + OTP_EXPIRY_MS,
    });
};

const verifyOTP = (phone, otp) => {
    const record = otpStore.get(phone);
    if (!record) return { valid: false, reason: 'OTP not found. Please request a new OTP.' };
    if (Date.now() > record.expiresAt) {
        otpStore.delete(phone);
        return { valid: false, reason: 'OTP has expired. Please request a new OTP.' };
    }
    if (record.otp !== otp) {
        return { valid: false, reason: 'Invalid OTP. Please try again.' };
    }
    otpStore.delete(phone); // OTP can only be used once
    return { valid: true };
};

const clearOTP = (phone) => {
    otpStore.delete(phone);
};

module.exports = { generateOTP, saveOTP, verifyOTP, clearOTP };
