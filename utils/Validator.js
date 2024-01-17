

module.exports = {

 // name validation 
 nameValid:(username)=>{
    usernameRegex=/^[A-Za-z]+$/
    return username.length >1 && usernameRegex.test(username)
},

// email validation 
 emailValid:(email)=>{
     emailRegex=/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email)
},


// phone validation 
 phoneValid:(phone)=>{
    phoneRegex=/^[0-9]{10}$/
    return phoneRegex.test(phone)
},

// passwordValid validation 
 passwordValid:(password)=>{
    const length=/^.{6,}$/
    const uppercase=/[A-Z]/
    const lowercase=/[a-z]/
    const number=/\d/
    const specialcharecter=/[!@#$%^&*(),.?":{}|<>]/

    const haslength=length.test(password)
    const hasuppercase=uppercase.test(password)
    const haslowercase=lowercase.test(password)
    const hasnumber=number.test(password)
    const hasspecialcharecter=specialcharecter.test(password)
    return haslength && hasuppercase && haslowercase && hasnumber && hasspecialcharecter
},

// confirmpassword Validation 
confirmpasswordValid:(confirmpassword,password)=>{
    return confirmpassword==password
},

 alphanumValid : (name) => {
    nameRegex = /^(?! )[A-Za-z0-9 ]*(?<! )$/;
    return nameRegex.test(name);
},

 onlyNumbers : (str) => {
     numbersOnlyRegex = /^[1-9][0-9]*(\.[0-9]+)?$/;
    return str.length > 0 && numbersOnlyRegex.test(str);
},

 zerotonine : (str) => {
     numbersOnlyRegex = /^(0|[1-9][0-9]*)$/;
    return str.length > 0 && numbersOnlyRegex.test(str);
},

 uppercaseAlphanumValid : (input) => {
     regex = /^[A-Z0-9]*$/;
    return regex.test(input);
},


 isFutureDate : (selectedDate) => {
     selectedDateTime = new Date(selectedDate);
    const currentDate = new Date();
    return selectedDateTime > currentDate;
},

}


