const verifyOTP = async (otp,Gotp) => {
    const enteredOTP = parseInt(otp);
    const storedOTP = parseInt(Gotp);
    try {
        if(enteredOTP === storedOTP)
        return {otpVarified:true};
        return res.status(400).json({ message: "Invalid OTP" });
    } catch (error) {
        console.error(error);
        return {otpVarified:false};
    }
};
module.exports ={verifyOTP}
