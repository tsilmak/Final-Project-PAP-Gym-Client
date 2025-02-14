import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  try {
    const parsedNumber = phoneUtil.parseAndKeepRawInput(phoneNumber);
    return phoneUtil.isValidNumber(parsedNumber);
  } catch (error) {
    console.log(error);
    return false;
  }
};
