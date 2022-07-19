const express =require('express');
const router=express.Router();

const {
    newTask,   
    getSingleTask,
    getAllTask,
    updateSingleTask,
    deleteSingleTask,
    getListTasks
}=require('../controllers/taskController');

router.route('/new/task/').post(newTask)
router.route('/tasks').get(getAllTask);
router.route('/task/:id')
                         .get(getSingleTask)
                         .put(updateSingleTask)
                         .delete(deleteSingleTask)
router.route('/list/tasks/:id').get(getListTasks);

module.exports = router  