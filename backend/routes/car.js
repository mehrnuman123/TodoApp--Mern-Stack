const express =require('express')
const router=express.Router();

const {
    newCar,
    getCars,
    getSingleCar,
    updateSingleCar,
    deleteSingleCar,
    getAdminCarsCount

    
}=require('../controllers/carController');

const { isAuthenticated ,authorizeRoles}= require('../middleware/auth')

router.route('/admin/new/car').post(isAuthenticated,authorizeRoles('admin'),newCar) // add cars
router.route('/cars').get(getCars) // get car informations
router.route('/admin/car/:id')
                              .get(isAuthenticated,authorizeRoles('admin'),getSingleCar) // get single car information using id
                              .put(isAuthenticated,authorizeRoles('admin'),updateSingleCar) // admin update car  /api/v1/car/:id 
                              .delete(isAuthenticated,authorizeRoles('admin'),deleteSingleCar) // admin delete car /api/v1/car/:id
router.route('/admin/cars').get(isAuthenticated,authorizeRoles,getAdminCarsCount) // all cars for dashboard 
module.exports = router  