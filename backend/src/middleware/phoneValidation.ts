import {
    isValidPhoneNumber,
  } from 'libphonenumber-js'
  

  // keeping this middleware to add extra functionality from libphonenumber-js as requirement changes
  // parsing phone number to extract country and type
  // example: blocking 'TOLL_FREE' phone_numbers, blocking certain country phone number
  /*
    import parsePhoneNumber from 'libphonenumber-js'
    const phoneNumber = parsePhoneNumber(' 8 (800) 555-35-35 ', 'RU')
    if (phoneNumber) {
    phoneNumber.country === 'RU'
    phoneNumber.number === '+78005553535'
    phoneNumber.isPossible() === true
    phoneNumber.isValid() === true
    // Note: `.getType()` requires `/max` metadata: see below for an explanation.
    phoneNumber.getType() === 'TOLL_FREE'
    }
  */

  export const isValidPhone = (phoneNumber: string): boolean => {
     return isValidPhoneNumber(phoneNumber)
  }
  