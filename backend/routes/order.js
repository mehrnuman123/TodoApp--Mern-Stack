const express=require('express')
const router =express.Router();

const {newOrder,getSingleOrder,myOrders,getAllOrders,updateOrder,deleteOrder}=require('../controllers/orderController');
const {isAuthenticated, authorizeRoles}=require('../middleware/auth')

router.route('/order/new').post(isAuthenticated,newOrder) // create new order
router.route('/order/:id').get(isAuthenticated,getSingleOrder) // get single order??
router.route('/orders/me').get(isAuthenticated,myOrders) // get my orders 

router.route('/admin/orders').get(isAuthenticated,authorizeRoles('admin'),getAllOrders) // all orders 
router.route('/admin/order/:id')
    .put(isAuthenticated, authorizeRoles('admin'), updateOrder)  // alter or updateOrder
    .delete(isAuthenticated, authorizeRoles('admin'), deleteOrder);  // delete order

module.exports=router;