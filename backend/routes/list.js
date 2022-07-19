const express =require('express');
const router=express.Router();

const {
    newList,   
    getSingleList,
    getAllList,
    updateSingleList,
    deleteSingleList
}=require('../controllers/listController');

router.route('/new/list').post(newList)
router.route('/lists').get(getAllList)
router.route('/list/:id')
                         .get(getSingleList)
                         .put(updateSingleList)
                         .delete(deleteSingleList)

module.exports = router  