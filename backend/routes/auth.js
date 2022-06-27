const express = require('express');
const { is } = require('express/lib/request');
const router = express.Router();

const {registerUser,loginUser,
    forgotPassword,logout,
    getLoggedInUser,
    resetPassword,
    changePassword,
    updateProfile,
    getAllUsers,
    getUsersDetails,
    updateUser,
    deleteUser,
}=require('../controllers/authController')

const { isAuthenticated ,authorizeRoles}= require('../middleware/auth')
// register user
router.route('/register').post(registerUser)

//loging login user
router.route('/login').post(loginUser)

// Forgot password
router.route('/password/forgot').post(forgotPassword)

// Reset password
router.route('/password/reset/:token').put(resetPassword)

// currently logged in user
router.route('/me').get(isAuthenticated,getLoggedInUser)

// update password or change password
router.route('/password/update').put(isAuthenticated,changePassword)

// udpate profile
router.route('/me/update').put(isAuthenticated,updateProfile)

// logout the user
router.route('/logout').get(logout)

// get the list of all users
router.route('/admin/users').get(isAuthenticated,authorizeRoles('admin'),getAllUsers)

// single user details 
router.route('/admin/user/:id')
                              .get(isAuthenticated,authorizeRoles('admin'),getUsersDetails)
                              .put(isAuthenticated,authorizeRoles('admin'),updateUser)
                              .delete(isAuthenticated,authorizeRoles('admin'),deleteUser)

// admin update user details 
router.route('/admin/update/user')




module.exports= router      