let bankDetails = {};
let response    = {fields : {}};

////////////////////////////////////////////////////////////
//Call this function from external source - ie. FormAssembly
////////////////////////////////////////////////////////////

const initBankValidation = (bankCodeTFA, branchNumberTFA, accountNumberTFA) => {
  $(`#${bankCodeTFA}`).on('change', handleBankCode);		
	$(`#${branchNumberTFA}`).on('change', handleBranchNumber);		
	$(`#${accountNumberTFA}`).on('change', handleAccountNumber);


	$(`#${bankCodeTFA}, #${branchNumberTFA}, #${accountNumberTFA}`).blur(function() {      
    // Code to be executed when any of the specified elements lose focus
  	try{
			if (!isEmpty(bankDetails.bankCode) && !isEmpty(bankDetails.branchNumber) && !isEmpty(bankDetails.accountNumber)) {                                                                                                                                                                                                                                  
				response.fields.status = true;
				response.fields.message = 'All fields have been filled out.'                                                                                                                                                                         
				const isValid = checkPrimaryAccount(bankDetails.bankCode, bankDetails.branchNumber, bankDetails.accountNumber);
				console.log(`Bank validation check: ${isValid}`);
				if (isValid) {
					response.isValid = isValid;
					response.bankDetails = bankDetails;
					response.message = 'Bank details are valid.';
				} else {
					response.isValid = isValid;
					response.bankDetails = bankDetails;
					response.message = 'Bank details are not valid. Please check and try again.'
				}
			} else {
				response.fields.status = false;
				response.bankDetails = bankDetails;
				response.fields.message = 'Make sure to complete all the fields';
			}
		} catch (error){		
			response.message = error.message;
		}
		console.log(response);
  	return response;
    
  })

}

/////////////////////////////////////////////////////////////
//Handles the input of each field
/////////////////////////////////////////////////////////////

const handleBankCode = (input) => {
	bankCode = getBankCode(input.target.id);
	bankDetails.bankCode = bankCode;
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
// Retrieves the bank code number from selection in dropdown
///////////////////////////////////////////////////////////////

const getBankCode= (bankCodeTFA) => {    
		const selectedElement = $("#" + bankCodeTFA + " option:selected").text()
    const bankCode       = selectedElement.split(' ')[0];
  	console.log(bankCode);
    return bankCode.length === 1 ? '0' + bankCode : bankCode;
}

//////////////////////////////////////
//Check if fields are empty
/////////////////////////////////////

const isEmpty = (input) => {
// Check for empty string, null, or undefined
	if (input === '' || input === null || input === undefined || input === 'נא') {
    return true;
  }
	
    
// Convert to a string and trim whitespace to check for inputs that only contain spaces
  if (String(input).trim() === '') {
    return true;
	}
    
// Optionally, check if the input is a number and not NaN (Not-a-Number), which is a special value representing an undefined or unrepresentable value in JavaScript
  if (typeof input === 'number'&& isNaN(input)) {
    return true;
  }	
    
  return false;  // Input is not empty
}


///////////////////////////////////////////////////////////////
//Bank validation function
///////////////////////////////////////////////////////////////

const checkPrimaryAccount = (bankNumber, bankBranch, account) => {
    var lngRequiredAccountLength;
    var accountArray;
    var bankbranchArray;
    var validateBankAccount;
    var num, num1, num2;
    

    switch (bankNumber) {
      case '10': 
      case '13': 
      case '34': 
        lngRequiredAccountLength = 8;
        break;
      case '12': 
      case '04': 
      case '20': 
        lngRequiredAccountLength = 6;
        break;
      case '26': 
      case '11': 
      case '17': 
      case '31': 
      case '52': 
      case '09': 
      case '22': 
      case '46': 
      case '14': 
           lngRequiredAccountLength              = 9;
        if (bankNumber == '26') bankNumber = '31';
        break;
      default: 
        lngRequiredAccountLength = 9;
    }

    account = pad(account, lngRequiredAccountLength);
    if (account.length > 9)
      account = account.substr(account.length - 9);
    
    // check for account number correct length 
    if (account.length <= lngRequiredAccountLength)
    {
      accountArray = account.split('');
      
      if (bankNumber == 20 && bankBranch > 400) {
        bankBranch = bankBranch - 400;
      }
      bankBranch      = pad(bankBranch, 3);
      bankbranchArray = bankBranch.split('');

      switch (bankNumber) {
         case '18':
            let branchPlusAccount = parseInt(bankBranch).toString() + account.substring(0, 7);
            validateBankAccount = 98 - (branchPlusAccount % 97) == parseInt(account.slice(-2));
            break;
        case '54': 
          validateBankAccount = true;
        case '10': 
        case '13': 
        case '34': 
          num = String(Number(bankbranchArray[0] * 10 + bankbranchArray[1] * 9 + bankbranchArray[2] * 8 + accountArray[0] * 7 + accountArray[1] * 6 + accountArray[2] * 5 + accountArray[3] * 4 + accountArray[4] * 3 + accountArray[5] * 2) + Number(account.substr(account.length - 2)));
          num = num.substr(num.length - 2);
          if (num == '90' || num == '72' || num == '70' || num == '60' || num == '20')
            validateBankAccount = true;
          else
            validateBankAccount = false;
          break;
        case '12': 
          num = Number(bankbranchArray[0] * 9 + bankbranchArray[1] * 8 + bankbranchArray[2] * 7 + accountArray[0] * 6 + accountArray[1] * 5 + accountArray[2] * 4 + accountArray[3] * 3 + accountArray[4] * 2 + accountArray[5] * 1);
          num = num % 11;
          if (num == 0 || num == 2 || num == 4 || num == 6)
            validateBankAccount = true;
          else
            validateBankAccount = false;
          break;
        case '04': 
          num = Number(bankbranchArray[0] * 9 + bankbranchArray[1] * 8 + bankbranchArray[2] * 7 + accountArray[0] * 6 + accountArray[1] * 5 + accountArray[2] * 4 + accountArray[3] * 3 + accountArray[4] * 2 + accountArray[5] * 1);
          num = num % 11;
          if (num == 0 || num == 2)
            validateBankAccount = true;
          else
            validateBankAccount = false;
          break;
        case '11': 
        case '17': 
          num = Number(accountArray[0] * 9 + accountArray[1] * 8 + accountArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
          num = num % 11;
          if (num == 0 || num == 2 || num == 4)
            validateBankAccount = true;
          else
            validateBankAccount = false;
          break;
        case '20': 
          num = Number(bankbranchArray[0] * 9 + bankbranchArray[1] * 8 + bankbranchArray[2] * 7 + accountArray[0] * 6 + accountArray[1] * 5 + accountArray[2] * 4 + accountArray[3] * 3 + accountArray[4] * 2 + accountArray[5] * 1);
          num = num % 11;
          if (num == 0 || num == 2 || num == 4)
            validateBankAccount = true;
          else
            validateBankAccount = false;
          break;
        case '31': 
        case '52': 
          num  = Number(accountArray[0] * 9 + accountArray[1] * 8 + accountArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
          num  = num % 11;
          num1 = Number(accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
          num1 = num1 % 11;
          if (num == 0 || num1 == 0 || num == 6 || num1 == 6)
            validateBankAccount = true;
          else
            validateBankAccount = false;
          break;
        case '09': 
          num = Number(accountArray[0] * 9 + accountArray[1] * 8 + accountArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
          num = num % 10;
          if (num == 0)
            validateBankAccount = true;
          else
            validateBankAccount = false;
          break;
        case '22': 
          num = Number(accountArray[0] * 3 + accountArray[1] * 2 + accountArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2);
          num = num % 11;
          if (11 - num == accountArray[8])
            validateBankAccount = true;
          else
            validateBankAccount = false;
          break;
        case '46': 
          num  = Number(bankbranchArray[0] * 9 + bankbranchArray[1] * 8 + bankbranchArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
          num  = num % 11;
          num1 = Number(accountArray[0] * 9 + accountArray[1] * 8 + accountArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
          num1 = num1 % 11;
          num2 = Number(accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
          num2 = num2 % 11;
          if (num == 0)
            validateBankAccount = true;
          else if (num == 2 && (bankBranch == '154' || bankBranch == '166' || bankBranch == '178' || bankBranch == '181' || bankBranch == '183' || bankBranch == '191' || bankBranch == '192' || bankBranch == '503' || bankBranch == '505' || bankBranch == '507' || bankBranch == '515' || bankBranch == '516' || bankBranch == '527' || bankBranch == '539'))
            validateBankAccount = true;
          else if (num1 == 0 || num2 == 0)
            validateBankAccount = true;
          else
            validateBankAccount = false;
          break;
        case '14': 
          num  = Number(bankbranchArray[0] * 9 + bankbranchArray[1] * 8 + bankbranchArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
          num  = num % 11;
          num1 = Number(accountArray[0] * 9 + accountArray[1] * 8 + accountArray[2] * 7 + accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
          num1 = num1 % 11;
          num2 = Number(accountArray[3] * 6 + accountArray[4] * 5 + accountArray[5] * 4 + accountArray[6] * 3 + accountArray[7] * 2 + accountArray[8] * 1);
          num2 = num2 % 11;
          if (num == 0)
            validateBankAccount = true;
          else if (num == 2 && (bankBranch == '347' || bankBranch == '361' || bankBranch == '362' || bankBranch == '363' || bankBranch == '365' || bankBranch == '385'))
            validateBankAccount = true;
          else if (num == 4 && (bankBranch == '361' || bankBranch == '362' || bankBranch == '363'))
            validateBankAccount = true;
          else if (num1 == 0 || num2 == 0)
            validateBankAccount = true;
          else
            validateBankAccount = false;
          break;
        default: 
          validateBankAccount = false;
      }
      
      if (bankBranch >= 10 && bankBranch <= 99) {
        bankBranch = '0' + bankBranch;
      }
    }
    else {
       validateBankAccount = false;
    }    
        
    return validateBankAccount;
}

const pad = (str, max) => {
    str = str.toString();
    return str.length < max ? pad("0" + str, max): str;
}