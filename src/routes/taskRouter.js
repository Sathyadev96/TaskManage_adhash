import express from 'express';
import  {createTask,editTaskbyId,deleteTaskbyId,getTasks}  from '../controllers/taskController.js';
const router = express.Router();

router.post('/tasks',createTask);
router.get('/tasks',getTasks);
router.put('/tasks/:id',editTaskbyId);
router.delete('/tasks/:id',deleteTaskbyId); 

export default router;

