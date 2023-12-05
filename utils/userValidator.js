// name validation 
const nameValid=(username)=>{
    usernameRegex=/^[A-Za-z]+$/
    return username.length >1 && usernameRegex.test(username)
}

// email validation 
const emailValid=(email)=>{
    const emailRegex=/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email)
}


// phone validation 
const phoneValid=(phone)=>{
    phoneRegex=/^[0-9]{10}$/
    return phoneRegex.test(phone)
}

// passwordValid validation 
const passwordValid=(password)=>{
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
}

// confirmpassword Validation 
const confirmpasswordValid=(confirmpassword,password)=>{
    return confirmpassword==password
}

// module exporting
module.exports={
    emailValid,
    nameValid,
    phoneValid,
    passwordValid,
    confirmpasswordValid
    

}