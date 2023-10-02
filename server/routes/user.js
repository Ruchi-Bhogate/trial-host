const express = require('express');
const router = express.Router();
const User = require('../models/user_model');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const ResetToken = require('../models/reset_token');
const generateToken = require('../helper/generate_token')


router.post('/login', async (req, res) => {
  try {
    let user;
    if (req.body.emailOrUsername.includes('@')) {
      user = await User.findOne({ email: req.body.emailOrUsername });
    } else {
      user = await User.findOne({ username: req.body.emailOrUsername });
    }

    if (!user) return res.status(400).send('User not found');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');

    res.send('Logged in successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/signup', async (req, res) => {
    try {
      const emailName = req.body.email.split('@')[0];
      const randomNum = Math.floor(Math.random() * 10000);
      const username = `${emailName}${randomNum}`;

      if(req.body.password != req.body.confirmpassword)
      res.send({message: 'password not matched'});
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        role: req.body.role,
        email: req.body.email,
        username: username,
        password: hashedPassword,
      })
      res.send({message :'ok'})
    } catch (error) {
        console.log(error)
        res.json({status: 'error', error: 'Duplicate email'})
    }
  });

  router.post('/Forgot', async (req,res) => {
    const email = req.body.email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No account with this email found." });
  }
  const token = generateToken();
  //console.log("generate Token", token);
//console.log("user",user);
    // Save the token in the database
    const resetToken = new ResetToken({
        userId: user.username,
        token: token
    });
    await resetToken.save();
    let mailTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user:"ubookint@gmail.com",
            pass:"ufgj gaun khqk vpsn"
        }
    });
    const details = {
        from:"Support@UBook.com",
        to:email,
        subject:"Password Reset",
        //text:'http://localhost:3000/Reset/${user._id}'
        html: `<p>Hi, This email is being sent in response to a password reset request. Please click <a href ='http://localhost:3000/Reset?token=${token}/'>here</a> to reset your password.</p>`
    }
    const check = await mailTransport.sendMail(details);
    res.send({message: 'ok'});
    console.log =("Status ",check.status);
});

  router.post('/reset/:token', async (req, res) => {
    const {token} = req.params
    const resetToken = await ResetToken.findOne({ token });
    //console.log("resetToken",resetToken)
    
    if (!resetToken) {
        return res.status(400).json({ message: "Invalid or expired token." });}
    //const {password} = req.body
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //console.log(hashedPassword)

    try{
     // User.findByIdAndUpdate({_id:id},{password})
     const user = await User.findOne({username:resetToken.userId});
     //console.log(user);
    user.password = hashedPassword;
    await user.save();
    await resetToken.delete();
      res.send('Password was changed');
    }
    catch (error) {
      res.status(500).send(error.message)
    }
  });
  
module.exports = router;
