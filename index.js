  //TODO Coonect all the bank code numbers to the correct functions

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
	const bankCodeElement = document.getElementById('bankNumber');
	const selectedOption = bankCodeElement.options[bankCodeElement.selectedIndex];
	const innerHTML = selectedOption.innerHTML;
	let bankCode = innerHTML.split(' ')[0];
	bankCode = bankCode.length === 1 ? '0' + bankCode : bankCode;
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
    const isAllFilled = [bankCode, branchNumber, accountNumber].every(field => !isEmpty(field));
    
    if (isAllFilled) {
      const isValid = checkPrimaryAccount(bankCode, branchNumber, accountNumber);
      response = {
        isValid,
        bankDetails,
        message: isValid ? 'Bank details are valid.' : 'Bank details are not valid. Please check and try again.'
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

///////////////////////////////////////////////////////////////
// Retrieves the bank code number from selection in dropdown
///////////////////////////////////////////////////////////////

const getBankCode = (bankCodeTFA) => {    
	const selectedElement = $("#" + bankCodeTFA + " option:selected").text();
    const bankCode = selectedElement.split(' ')[0];
    return bankCode.length === 1 ? '0' + bankCode : bankCode;
}

///////////////////////////////////////////////////////////////
// Main function to validate primary account based on bank code
///////////////////////////////////////////////////////////////

const checkPrimaryAccount = (bankNumber, bankBranch, account) => {
  let validateBankAccount = false;
  debugger;
  switch (bankNumber) {
    case '10': 
    case '13':
    case '34': 
      validateBankAccount = validateBank10_13_34(bankBranch, account);
      break;
    case '23': 
      validateBankAccount = validateBank23(bankBranch, account)
    case '12': 
      validateBankAccount = validateBank12(bankBranch, account);
      break;
    case '04': 
      validateBankAccount = validateBank04(bankBranch, account);
      break;
    case '20': 
      validateBankAccount = validateBank20(bankBranch, account);
      break;
    case '47': 
      validateBankAccount = validateBank47(account);
      break;
    case '31': 
    case '52': 
      validateBankAccount = validateBank31_52(account);
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

// Banks 10, 13, 34 - Leumi
const validateBank10_13_34 = (bankBranch, account) => {
  const accountArray = account.split('').map(Number);
  const bankbranchArray = pad(bankBranch, 3).split('').map(Number);
  let num = String(Number(bankbranchArray[0] * 10 + bankbranchArray[1] * 9 + bankbranchArray[2] * 8 + accountArray[0] * 7 + accountArray[1] * 6 + accountArray[2] * 5 + accountArray[3] * 4 + accountArray[4] * 3 + accountArray[5] * 2) + Number(account.substr(account.length - 2)));
  num = num.substr(num.length - 2);
  return ['90', '72', '70', '60', '20'].includes(num);
}

  //Bank 23 - HSBC
const validateBank23 = (bankBranch, account) => {
  if (accountNumber.length !== 9) {
    return false;
  }

// Convert the account number to an array of digits
  const digits = account.split('').map(Number);

  // Validation for branch 101: The 7th digit (index 6) must be 4
  if (bankBranch === 101) {
      if (digits[6] !== 4) {
          return false;
      }
  }

// Validation for branch 102: The account number must end with "001"
  if (bankBranch === 102) {
      if (!account.endsWith('001')) {
          return false;
      }
  }

// If the branch code is neither 101 nor 102, or all checks passed
  return true;
  
}

// Bank 12
const validateBank12 = (bankBranch, account) => {
  const accountArray = account.split('').map(Number);
  const bankbranchArray = pad(bankBranch, 3).split('').map(Number);
  let num = Number(bankbranchArray[0] * 9 + bankbranchArray[1] * 8 + bankbranchArray[2] * 7 + accountArray[0] * 6 + accountArray[1] * 5 + accountArray[2] * 4 + accountArray[3] * 3 + accountArray[4] * 2 + accountArray[5] * 1);
  num = num % 11;
  return [0, 2, 4, 6].includes(num);
}

// Bank 04
const validateBank04 = (bankBranch, account) => {
  const  accountArray      = account.split('').map(Number);
  const  bankbranchArray   = pad(bankBranch, 3).split('').map(Number);
  let    num               = Number(bankbranchArray[0] * 9 + bankbranchArray[1] * 8 + bankbranchArray[2] * 7 + accountArray[0] * 6 + accountArray[1] * 5 + accountArray[2] * 4 + accountArray[3] * 3 + accountArray[4] * 2 + accountArray[5] * 1);
         num               = num % 11;
  return num             === 0 || num === 2;
}

// Bank 20
const validateBank20 = (bankBranch, account) => {
  if (bankBranch > 400 && bankBranch < 800) {
    bankBranch = bankBranch - 400;
  } 
  const accountArray = account.split('').map(Number);
  const bankbranchArray = pad(bankBranch, 3).split('').map(Number);
  let num = Number(bankbranchArray[0] * 9 + bankbranchArray[1] * 8 + bankbranchArray[2] * 7 + accountArray[0] * 6 + accountArray[1] * 5 + accountArray[2] * 4 + accountArray[3] * 3 + accountArray[4] * 2 + accountArray[5] * 1);
  num = num % 11;
  return [0, 2, 4].includes(num);
}

// Banks 11, 17
/*const validateBank11_47 = (account) => {
  const accountArray = account.split('').map(Number);
  let num = Number(accountArray[0] * 9 + accountArray[1] * 8 + accountArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
  num = num % 11;
  return [0, 2, 4].includes(num);
}*/

// Banks 31, 52
const validateBank31_52 = (account) => {
  const accountArray = account.split('').map(Number);
  let num = Number(accountArray[0] * 9 + accountArray[1] * 8 + accountArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
  let num1 = Number(accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
  num = num % 11;
  num1 = num1 % 11;
  return num === 0 || num1 === 0 || num === 6 || num1 === 6;
}

// Bank 09 - Bank HaDoar
const validateBank09 = (account) => {
  const accountArray = account.split('').map(Number);
  let num = Number(accountArray[0] * 9 + accountArray[1] * 8 + accountArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
  num = num % 10;
  return num === 0;
}

// Bank 22 - Citibank
const validateBank22 = (account) => {
  const accountArray = account.split('').map(Number);
  let num = Number(accountArray[0] * 3 + accountArray[1] * 2 + accountArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2);
  num = num % 11;
  return (11 - num) === accountArray[8];
}

// Bank 46
const validateBank46 = (bankBranch, account) => {
  const accountArray = account.split('').map(Number);
  const bankbranchArray = pad(bankBranch, 3).split('').map(Number);
  let num = Number(bankbranchArray[0] * 9 + bankbranchArray[1] * 8 + bankbranchArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
  let num1 = Number(accountArray[0] * 9 + accountArray[1] * 8 + accountArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
  let num2 = Number(accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
  num = num % 11;
  num1 = num1 % 11;
  num2 = num2 % 11;
  const validBranches = ['154', '166', '178', '181', '183', '191', '192', '503', '505', '507', '515', '516', '527', '539'];
  return num === 0 || (num === 2 && validBranches.includes(bankBranch)) || num1 === 0 || num2 === 0;
}

// Bank 14
const validateBank14 = (bankBranch, account) => {
  const accountArray = account.split('').map(Number);
  const bankbranchArray = pad(bankBranch, 3).split('').map(Number);
  let num = Number(bankbranchArray[0] * 9 + bankbranchArray[1] * 8 + bankbranchArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
  let num1 = Number(accountArray[0] * 9 + accountArray[1] * 8 + accountArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
  let num2 = Number(accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
  num = num % 11;
  num1 = num1 % 11;
  num2 = num2 % 11;
  const validBranches1 = ['347', '361', '362', '363', '365', '385'];
  const validBranches2 = ['361', '362', '363'];
  return num === 0 || (num === 2 && validBranches1.includes(bankBranch)) || (num === 4 && validBranches2.includes(bankBranch)) || num1 === 0 || num2 === 0;
}

// Bank 54 - הבנק ההודי
const validateBank54 = (accountNumber) => {
  return true; // Assuming all account numbers are valid since no specific logic is provided.
}

// Bank 03 - בנק אש
const validateBank03 = (accountNumber) => {
  const digits = accountNumber.split('').map(Number);
  const multipliers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const sum = digits.reduce((acc, digit, index) => acc + digit * multipliers[index], 0);
  return sum % 11 === 0;
}

// Bank 47
const validateBank47 = (accountNumber) => {
  const digits = accountNumber.split('').map(Number);
  const multipliers = [9, 8, 6, 4, 3, 7, 2, 5];
  const sum = digits.reduce((acc, digit, index) => acc + digit * multipliers[index], 0);
  const remainder = sum % 11;
  const checkDigit = 11 - remainder;
  return digits[digits.length - 1] === checkDigit;
}

// Bank 18 - One Zero
const validateBank18 = (bankBranch, accountNumber) => {
  const branchPlusAccount = parseInt(bankBranch).toString() + accountNumber.substring(0, 7);
  return 98 - (branchPlusAccount % 97) === parseInt(accountNumber.slice(-2));
}

// Bank 15 - אופק אגודת אשראי
const validateBank15 = (bankBranch, accountNumber) => {
  const branchPlusAccount = parseInt(bankBranch).toString() + accountNumber.substring(0, 7);
  return 98 - (branchPlusAccount % 97) === parseInt(accountNumber.slice(-2));
}

  // Bank 35
const validateBank35 = (bankBranch, accountNumber) => {
  const branchPlusAccount = `${bankBranch}${accountNumber}`;
    const mod97Result = parseInt(branchPlusAccount, 10) % 97;
    const checkDigits = 98 - mod97Result;
    const accountWithCheckDigits = `${checkDigits}${accountNumber}`;
    const originalCheckDigits = parseInt(accountNumber.slice(-2), 10);
    return checkDigits === originalCheckDigits; 
}



///////////////////////////////////////////////////////////////
// Pad function for account numbers
///////////////////////////////////////////////////////////////

const pad = (str, max) => {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

///////////////////////////////////////////////////////////////
// Initialize the validation logic when the document is ready
///////////////////////////////////////////////////////////////

initBankValidation();
