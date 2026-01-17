import express from 'express';
import { addCategory, listCategories, removeCategory, updateCategory } from '../controllers/categoryController.js';
import adminAuth from '../middleware/adminAuth.js';

const categoryRouter = express.Router();

categoryRouter.post('/add', adminAuth, addCategory);
categoryRouter.get('/list', listCategories);
categoryRouter.post('/list', listCategories); // Support POST for some admin clients
categoryRouter.post('/remove', adminAuth, removeCategory);
categoryRouter.post('/update', adminAuth, updateCategory);

export default categoryRouter;
