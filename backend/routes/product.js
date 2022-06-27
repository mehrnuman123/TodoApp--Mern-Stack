const express =require('express')
const router=express.Router();

const {
    newProduct,
    getProducts,
    getSingleProduct,
    updateSingleProduct, 
    deleteSingleProduct,
    createProductReview,
    getProductReviews,
    deleteReview
}=require('../controllers/productController');

const { isAuthenticated ,authorizeRoles}= require('../middleware/auth')

router.route('/products').get(getProducts) // get all products
router.route('/product/:id').get(getSingleProduct) // get single product from the database


router.route('/admin/product/new').post(isAuthenticated, authorizeRoles('admin'), 
newProduct)   // add new products
router.route('/admin/product/:id')
                                .put(isAuthenticated, authorizeRoles('admin') ,updateSingleProduct) // update and delete single product
                                .delete(isAuthenticated,authorizeRoles('admin'),deleteSingleProduct) // delete single product

router.route('/review').put(isAuthenticated, createProductReview)  // update or create reviews
router.route('/reviews').get(isAuthenticated, getProductReviews)   // get all the reviews from specific product
router.route('/reviews/:id').delete(isAuthenticated, deleteReview)  // delete a review
module.exports = router  