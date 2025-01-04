const sendToken = (user, code, res) => {
    const token = user.getJwtToken();
  
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 
      httpOnly: true,
    };
  
    res.status(code).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  };
  
  export default sendToken;
  