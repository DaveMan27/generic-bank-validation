let bankDetails = {};

                                      // Initialization of bank validation
const initBankValidation = () => {
  const bankCodeElement = document.getElementById('bankNumber');
  bankCodeElement.addEventListener('change', handleBankCode);
  
  const branchNumberElement = document.getElementById('branchNumber');
  branchNumberElement.addEventListener('change', handleBranchNumber);

  const accNumberElement = document.getElementById('accountNumber');
  accNumberElement.addEventListener('change', handleAccountNumber);
}

                                      ///////////////////////////////////////////////////////////////
                                      // Handles the input of each field
                                      ///////////////////////////////////////////////////////////////

const handleBankCode = (input) => {
	const bankCodeElement      = document.getElementById('bankNumber');
	const selectedOption       = bankCodeElement.options[bankCodeElement.selectedIndex];
	const innerHTML            = selectedOption.innerHTML;
	let   bankCode             = innerHTML.split(' ')[0];
	      bankCode             = bankCode.length === 1 ? '0' + bankCode : bankCode;
	      bankDetails.bankCode = bankCode;
	console.log(bankDetails);
}

const handleBranchNumber = (input) => {
  bankDetails.branchNumber = String(input.target.value);
  console.log(bankDetails);
}

const handleAccountNumber = (input) => {
  bankDetails.accountNumber = String(input.target.value);
  console.log(bankDetails);
}

                                      ///////////////////////////////////////////////////////////////
                                      // Checks if inputs are empty
                                      ///////////////////////////////////////////////////////////////

const isEmpty = (input) => {
  if (input === '' || input === null || input === undefined) {
    return true;
  }
  
  if (String(input).trim() === '') {
    return true;
  }
  
  if (typeof input === 'number' && isNaN(input)) {
    return true;
  }	
  
  return false;  // Input is not empty
}

                                      ///////////////////////////////////////////////////////////////
                                      // Validates the bank details
                                      ///////////////////////////////////////////////////////////////

const validateBankDetails = () => {
  let response = { fields: {} };
  console.log('hello validate bank details');
  
  try {
    const { bankCode, branchNumber, accountNumber } = bankDetails;
    const isAllFilled                               = [bankCode, branchNumber, accountNumber].every(field => !isEmpty(field));
    
    if (isAllFilled) {
      const isValid  = checkPrimaryAccount(bankCode, branchNumber, accountNumber);
            response = {
        isValid,
        bankDetails,
        message: isValid ? 'Bank details are valid.': 'Bank details are not valid. Please check and try again.'
      };
    } else {
      response = {
        fields: { status: false, message: 'Make sure to complete all the fields' },
        bankDetails,
        isValid: false,
        message: 'Bank details are not valid. Please check and try again.'
      };
    }
  } catch (error) {
    response.message = error.message;
  }
  
  console.log(response);
  return response;
}

const getBankCode = (bankCodeTFA) => {    
 const  selectedElement   = $("#" + bankCodeTFA + " option:selected").text();
 const  bankCode          = selectedElement.split(' ')[0];
 return bankCode.length === 1 ? '0' + bankCode : bankCode;
}

const checkPrimaryAccount = (bankNumber, bankBranch, account) => {
  let validateBankAccount = false;
  switch (bankNumber) {
    case '10': 
    case '34': 
      validateBankAccount = validateBank10_34(bankBranch, account);  //Checked
      break;
    case '23': 
      validateBankAccount = validateBank23(bankBranch, account)
    case '12': 
      validateBankAccount = validateBank12(bankBranch, account);  //Checked
      break;
    case '13': 
      validateBankAccount = validateBank13(bankBranch, account);  //Checked
      break;
    case '04': 
      validateBankAccount = validateBank04(bankBranch, account);  //Checked
      break;
    case '11': 
    case '17': 
      validateBankAccount = validateBank11_17(account);  // Checked
      break;    
    case '20': 
      validateBankAccount = validateBank20(bankBranch, account);  // Checked
      break;
    case '47': 
      validateBankAccount = validateBank47(account);
      break;
    case '31': 
    case '52': 
      validateBankAccount = validateBank31_52(bankBranch, account, bankNumber);
      break;
    case '09': 
      validateBankAccount = validateBank09(account);
      break;
    case '22': 
      validateBankAccount = validateBank22(account);
      break;
    case '46': 
      validateBankAccount = validateBank46(bankBranch, account);
      break;
    case '14': 
      validateBankAccount = validateBank14(bankBranch, account);
      break;
    case '54': 
      validateBankAccount = validateBank54(account);
      break;
    case '03': 
      validateBankAccount = validateBank03(account);
      break;
    case '18': 
      validateBankAccount = validateBank18(bankBranch, account);
      break;
    case '15': 
      validateBankAccount = validateBank15(bankBranch, account);
      break;
    case '35': 
      validateBankAccount = validateBank35(bankBranch, account);
      break;
    default: 
      validateBankAccount = false;
  }
  
  return validateBankAccount;
}

                                      ///////////////////////////////////////////////////////////////
                                      // Bank-specific validation functions
                                      ///////////////////////////////////////////////////////////////

const validateBank10_34 = (bankBranch, account) => {
  const branchMultipliers  = [10, 9, 8];                 // Multipliers for the branch digits
  const accountMultipliers = [7, 6, 5, 4, 3, 2];         // Multipliers for the account digits
  const accountTypeCodes   = [110, 330, 340, 180, 128];  // Possible account type codes
  let   accountStr         = pad(account, 8);  
  console.log('Acc string', accountStr);
  const branchStr  = bankBranch.toString().padStart(3, '0');  // Pad branch number to 3 digits
        accountStr = accountStr.toString().substring(0, 6);      // Pad account number to 6 digits
  
  const finalDigitsStr = account.slice(-2);  
  let sum = 0;
  for (let i = 0; i < branchStr.length; i++) {
    sum += parseInt(branchStr[i]) * branchMultipliers[i];
  }
  for (let i = 0; i < accountStr.length; i++) {
    sum += parseInt(accountStr[i]) * accountMultipliers[i];
  }

  // Iterate through each account type code
  for (const accountTypeCode of accountTypeCodes) {
    if (accountTypeCode == 110 && !(['20', '23', '00'].includes(finalDigitsStr))) {
      continue;
    };    
    let totalSum = sum + accountTypeCode;
    let modResult = 100 - (totalSum % 100);
    console.log('Mod', modResult);
    if (modResult == finalDigitsStr) {  // Adjust this condition to fit actual rule
      console.log(`Valid with account type code: ${accountTypeCode}, MOD result: ${modResult}`);
      return true;  // Return true as soon as we find a valid account
    }
  }
                                          // If no valid account type code matches, return false
  console.log("Invalid account");
  return false;
}

                                          //Bank 23 - HSBC
const validateBank23 = (bankBranch, account) => {
  if (account.length !== 9) {
    return false;
  }

                                      // Convert the account number to an array of digits
  const digits = account.split('').map(Number);

                                        // Validation for branch 101: The 7th digit (index 6) must be 4
  if (bankBranch.toString() === '101') {
      if (digits[6] !== 4) {
          return false;
      }
  }

  /* Validation for branch 102: The account number must end with "001"*/
  if (bankBranch.toString() === '102') {
      if (!account.endsWith('001')) {
          return false;
      }
  }

  // If the branch code is neither 101 nor 102, or all checks passed
  return true;  
}

                                      // Bank 12 - Bank HaPoalim
const validateBank12 = (bankBranch, account) => {
  account = pad(account, 6);
  const accountArray    = account.split('').map(Number);
  const bankbranchArray = pad(bankBranch, 3).split('').map(Number);
  let   num             = Number(bankbranchArray[0] * 9 + bankbranchArray[1] * 8 + bankbranchArray[2] * 7 + accountArray[0] * 6 + accountArray[1] * 5 + accountArray[2] * 4 + accountArray[3] * 3 + accountArray[4] * 2 + accountArray[5] * 1);
        num             = num % 11;
  console.log(num);
  return [0, 2, 4, 6].includes(num);
}

const validateBank13 = (bankBranch, account) => {
  account = pad(account, 8);
  const branchMultipliers = [10, 9, 8];                              // Multipliers for the branch digits
  const accountMultipliers = [7, 6, 5, 4, 3, 2];
  const branchStr          = bankBranch.toString().padStart(3, '0');  // Pad branch number to 3 digits
  const accountStr         = account.toString().substring(0, 6);      // Pad account number to 6 digits
  let   sum                = 0;
  for (let i = 0; i < branchStr.length; i++) {
    sum += parseInt(branchStr[i]) * branchMultipliers[i];
  }
  for (let i = 0; i < accountStr.length; i++) {
    sum += parseInt(accountStr[i]) * accountMultipliers[i];
  }
  const finalAccountDigits = Number(account.toString()[6] + account.toString()[7]);
        sum                = finalAccountDigits + sum;
  
  const num = Math.abs(sum) % 100;
  console.log(num);
  return [70, 72, 90, 20, 60].includes(num);
}

                                      // Bank 04
const validateBank04 = (bankBranch, account) => {
         account           = pad(account, 6);
  const  accountArray      = account.split('').map(Number);
  const  bankbranchArray   = pad(bankBranch, 3).split('').map(Number);
  let    num               = Number(bankbranchArray[0] * 9 + bankbranchArray[1] * 8 + bankbranchArray[2] * 7 + accountArray[0] * 6 + accountArray[1] * 5 + accountArray[2] * 4 + accountArray[3] * 3 + accountArray[4] * 2 + accountArray[5] * 1);
         num               = num % 11;
  return num             === 0 || num === 2;
}

                                    // Bank 20
const validateBank20 = (bankBranch, account) => {
  account = pad(account, 6);
  if (bankBranch > 400 && bankBranch < 800) {
    bankBranch = bankBranch - 400;
  } 
  const accountArray    = account.split('').map(Number);
  const bankbranchArray = pad(bankBranch, 3).split('').map(Number);
  let   num             = Number(bankbranchArray[0] * 9 + bankbranchArray[1] * 8 + bankbranchArray[2] * 7 + accountArray[0] * 6 + accountArray[1] * 5 + accountArray[2] * 4 + accountArray[3] * 3 + accountArray[4] * 2 + accountArray[5] * 1);
        num             = num % 11;
  return [0, 2, 4].includes(num);
}

                                    // Banks 11, 17
const validateBank11_17 = (account) => {
  const acc = pad(account, 9);
  const accountArray = acc.split('').map(Number);
  let   num          = Number(accountArray[0] * 9 + accountArray[1] * 8 + accountArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
        num          = num % 11;
  return [0, 2, 4].includes(num);
}

                                    // Banks 31, 52
const validateBank31_52 = (bankBranch, account, bankNumber) => {
  account = pad(account, 9);
  const accountArray = account.split('').map(Number);
  let   num          = Number(accountArray[0] * 9 + accountArray[1] * 8 + accountArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
        num          = num % 11;
  if ([0, 6].includes(num)) {
    return true;
  } else {
    let num1 = Number(accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
        num1 = num1 % 11;
    if ([0, 6].includes(num)) {
      return true;
    } else if (bankNumber == '31') {
      return validateBank14(bankBranch, account);
    }
  }
  
}

// Bank 09 - Bank HaDoar
const validateBank09 = (account) => {
         account        = pad(account, 9);
  const  accountArray   = account.split('').map(Number);
  let    num            = Number(accountArray[0] * 9 + accountArray[1] * 8 + accountArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
         num            = num % 10;
  return num          === 0;
}

                                    // Bank 22 - Citibank
const validateBank22 = (account) => {
  const accountArray   = account.split('').map(Number);
  let   num            = Number(accountArray[0] * 3 + accountArray[1] * 2 + accountArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2);
        num            = num % 11;
  return (11 - num)  === accountArray[8];
}

                                      // Bank 46
const validateBank46 = (bankBranch, account) => {
        account         = pad(account, 6);
  const accountArray    = account.split('').map(Number);
  const bankbranchArray = pad(bankBranch, 3).split('').map(Number);
  let   num             = Number(bankbranchArray[0] * 9 + bankbranchArray[1] * 8 + bankbranchArray[2] * 7 + accountArray[0] * 6 + accountArray[1] * 5 + accountArray[2] * 4 + accountArray[3] * 3 + accountArray[4] * 2 + accountArray[5] * 1);
        num             = num % 11;
  const validBranches   = ['154', '166', '178', '181', '183', '191', '192', '503', '505', '507', '515', '516', '527', '539'];
  if (validBranches.includes(bankBranch)) {
    return num === 2 || num === 0;
  } 
  
  return num === 0;
  
}

const validateBank14 = (bankBranch, account) => {
        account         = pad(account, 6);
  const accountArray    = account.split('').map(Number);
  const bankbranchArray = pad(bankBranch, 3).split('').map(Number);
  let   sum             = bankbranchArray[0] * 9 + bankbranchArray[1] * 8 + bankbranchArray[2] * 7 + accountArray[0] * 6 + accountArray[1] * 5 + accountArray[2] * 4 + accountArray[3] * 3 + accountArray[4] * 2 + accountArray[5] * 1;
  let   num             = sum % 11;
  const validBranches1 = ['347', '365', '384', '385'];
  const validBranches2    = ['361', '362', '363'];

  if (validBranches1.includes(bankBranch)) {
    return num === 0 || num === 2;
  } else if (validBranches2.includes(bankBranch)) {
    return num === 0 || num === 2 || num === 4;
  } else return num === 0;  
}

                                    // Bank 54 - הבנק ירושלים
const validateBank54 = (account) => {
  return true;  // Assuming all account numbers are valid since no specific logic is provided.
}

                                    // Bank 03 - בנק אש
const validateBank03 = (accountNumber) => {
  accountNumber = pad(accountNumber, 9);
  const digits = accountNumber.split('').map(Number);
  const multipliers = [9, 8, 7, 6, 5, 4, 3, 2, 1];
  let   sum         = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += parseInt(digits[i]) * multipliers[i];
  }
  return sum % 11 === 0;
}

                                    // Bank 47
const validateBank47 = (accountNumber) => {
  accountNumber = pad(accountNumber, 9);
  const digits = accountNumber.split('').map(Number);
  const multipliers = [9, 8, 6, 4, 3, 7, 2, 5];
  let   sum         = 0;
  for (let i = 0; i < digits.length-1; i++) {
    sum += parseInt(digits[i]) * multipliers[i];
  }
  const  remainder                   = sum % 11;
  const  checkDigit                  = 11 - remainder;
  return digits[digits.length - 1] === checkDigit;
}

                                    // Bank 18 - One Zero
const validateBank18 = (bankBranch, accountNumber) => {
  accountNumber = pad(accountNumber, 9);
  bankBranch = pad(bankBranch, 3);
  const branchPlusAccount = parseInt(bankBranch).toString() + accountNumber.substring(0, 7);
  return 98 - (branchPlusAccount % 97) === parseInt(accountNumber.slice(-2));
}

                                    // Bank 15 - אופק אגודת אשראי
const validateBank15 = (bankBranch, accountNumber) => {
  const branchPlusAccount = `${Number(bankBranch)}${accountNumber.slice(0, -2)}`;
  Number(branchPlusAccount);
  return 98 - (branchPlusAccount % 97) === parseInt(accountNumber.slice(-2));
}

                                      // Bank 35
const validateBank35 = (bankBranch, accountNumber) => {
  //accountNumber = pad(accountNumber, 8);
  const branchPlusAccount = `${bankBranch}${accountNumber.slice(0, -2)}`;
  const  mod97Result           = parseInt(branchPlusAccount, 10) % 97;
  const  checkDigits           = 98 - mod97Result;
  const originalCheckDigits = Number(accountNumber.slice(-2));
  return checkDigits         === originalCheckDigits;
}



                                    ///////////////////////////////////////////////////////////////
                                    // Pad function for account numbers
                                    ///////////////////////////////////////////////////////////////

const pad = (str, max) => {
  str = str.toString();
  return str.length < max ? pad("0" + str, max): str;
}

                                    ///////////////////////////////////////////////////////////////
                                    // Initialize the validation logic when the document is ready
                                    ///////////////////////////////////////////////////////////////

initBankValidation();
