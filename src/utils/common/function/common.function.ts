import { Logger } from '@nestjs/common';

/** Delays execution for the specified amount of milliseconds */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateReferenceNumber(type: string, userId: string) {
  const timeStamp = new Date().getTime() + Math.ceil(Math.random() * 1000);
  Logger.log(
    timeStamp,
    'reference number timestamp at presave hook ----------->',
  );
  const getChar = userId.slice(-4).toUpperCase();
  return `${type}${timeStamp}${getChar}AOD`;
}

/**
 * This function is used because of precision
 */
export async function roundToTwoDecimalPlace(n: number, digits: number) {
  const multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  return (Math.round(n) / multiplicator).toFixed(digits);
}

export function word(word: string) {
  return (word = word.charAt(0).toUpperCase() + word.slice(1));
}

// MONEY CONVERTER
export function roundAmount(amount: any, maxRange: number) {
  const converter = Math.pow(10, maxRange);
  return Math.round(amount * converter) / converter;
}

export function getNumericEnumValues(enumValue) {
  return Object.values(enumValue).filter((x) => typeof x === 'number');
}
export const generateRandomNumber = (length: number) => {
  const min = Math.pow(10, length - 1); // Minimum value for the OTP
  const max = Math.pow(10, length) - 1; // Maximum value for the OTP
  const code = Math.floor(Math.random() * (max - min + 1)) + min; // Generate random OTP
  return code; // Convert OTP to string
};

export const generateShipmentId = ()=>{
  const id = generateRandomNumber(16).toString();
   const formattedId = `SHP-${id.slice(0,8)}-${id.slice(8)}`
   return formattedId;
  }