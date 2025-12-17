import express from 'express';
import { addCategory, listCategories, removeCategory, updateCategory } from '../controllers/categoryController.js';

const categoryRouter = express.Router();

categoryRouter.post('/add', addCategory);
categoryRouter.get('/list', listCategories);
categoryRouter.post('/remove', removeCategory);
categoryRouter.post('/update', updateCategory);

export default categoryRouter;
