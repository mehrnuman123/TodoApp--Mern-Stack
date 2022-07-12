const User = require('../models/user')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sendToken = require('../utils/jwtToken')
const sendEmail= require('../utils/sendEmail')
const welcomeEmail = require('../utils/welcomeEmail')
const crypto = require('crypto');
const { truncate } = require('fs')
const cloudinary = require('cloudinary');


// Register a user   => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password } = req.body;
    
    const user = await User.create({
        name,
        email,
        password,
    })

   sendToken(user, 200, res)
   
   const newCarHubUser = req.body.name
   const newCarHubUserPwd = req.body.password
   console.log(newCarHubUser)
   const message = `Hi ${newCarHubUser}, We warmly wellcome you to our cars-hub !\n\nAnd you are password is ${newCarHubUserPwd}!\n\n`
       welcomeEmail ({
       email: user.email,
       subject: 'Greetings',
       message
   })

   res.status(200).json({
       success: true,
       message: `Email sent to: ${user.email}`
   })

})

// Login User  =>  /a[i/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body                                                                                                                                                                    ;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // Finding user in database
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res)
})

// Get Currently logged in user  :- api/v1/me
exports.getLoggedInUser = catchAsyncErrors(async (req, res, next) => {

    const currentUser = await User.findById(req.user.id);

    res.status(201).json({
        success:true,
        message: `welcome ${req.user.name}`,
        currentUser
    })
})

// update or change the current password   :- /api/v1/password/change

exports.changePassword = catchAsyncErrors( async(req, res, next) => {

    const user = await User.findById(req.user.id).select('+password')


    // Compare previous password
    const isMatched= await user.comparePassword(req.body.oldPassword)
    if (!isMatched){
        return next( new ErrorHandler('Old password mismatch'));
    }

    user.password = req.body.password
    await user.save();

    sendToken(user, 200, res)
})

// Update user profile   =>   /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    // Update avatar
    {/*
   if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id)

        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        })

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }
    */}
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        messsage: `new update is ${newUserData.name || email}`,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })
})


// Forgot Password   =>  /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    try {

        await sendEmail({
            email: user.email,
            subject: 'E-Shop Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500))
    }


})

// Reset Password   =>  /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    // Setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)

})


// logout user :> api/v1/logout
exports.logout= catchAsyncErrors( async(req, res, next) => {
    res.cookie('token',null, {
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:"User logout successfully"    
    })
})

// admin get all  the users    /api/v1/admin/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success:true,
        count:users.length,
        message:`number of users found: ${users}`,
        users
    })
})


// get users details      /api/v1/user/:id
exports.getUsersDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler('User not found', 404))
    }
    res.status(200).json({
        success:true,
        user

    })
})

// Update users    =>   /api/v1/admin/update/user
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role:req.body.role
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        messsage: `new update is ${newUserData.name || newUserData.email}`,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })
})

// delete the user with id :- api/v1/admin/delete/user/:id
exports.deleteUser= catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user){
        return next(new ErrorHandler('user not found',404));
    }

    await user.remove();

    res.status(200).json({
        success:true,
        message: 'User deleted successfully'
    })
})