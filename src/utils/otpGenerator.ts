/**
 * Generates a random 6-digit OTP (One-Time Password).
 * @returns A string containing a 6-digit OTP.
 */
export function generateOTP(): string {
    // Generate a random number between 100000 and 999999
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Convert the number to a string and pad with zeros if necessary
    return otp.toString().padStart(6, '0');
}

/**
 * Checks if the provided OTP is valid.
 * @param inputOTP The OTP to validate.
 * @param storedOTP The OTP stored in the database.
 * @param expirationTime The expiration time of the OTP.
 * @returns A boolean indicating whether the OTP is valid.
 */
export function isOTPValid(inputOTP: string, storedOTP: string, expirationTime: Date): boolean {
    const currentTime = new Date();
    return inputOTP === storedOTP && currentTime <= expirationTime;
}