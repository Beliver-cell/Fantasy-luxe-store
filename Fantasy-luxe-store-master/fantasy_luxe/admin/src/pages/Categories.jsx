import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Categories = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState('main');
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/category/list');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        backendUrl + '/api/category/add',
        { name: newCategoryName, type: categoryType },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Category added');
        setNewCategoryName('');
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to add category');
    }
    setLoading(false);
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/category/remove',
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Category deleted');
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleStartEdit = (category) => {
    setEditingCategory(category._id);
    setEditName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditName('');
  };

  const handleUpdateCategory = async (id, type) => {
    if (!editName.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + '/api/category/update',
        { id, name: editName, type },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Category updated');
        setEditingCategory(null);
        setEditName('');
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  const mainCategories = categories.filter(c => c.type === 'main');
  const subCategories = categories.filter(c => c.type === 'sub');

  const CategoryItem = ({ cat }) => (
    <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
      {editingCategory === cat._id ? (
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="px-2 py-1 border rounded flex-1"
            autoFocus
          />
          <button
            onClick={() => handleUpdateCategory(cat._id, cat.type)}
            className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={handleCancelEdit}
            className="px-2 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <span>{cat.name}</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleStartEdit(cat)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteCategory(cat._id)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Category Management</h2>
      
      <form onSubmit={handleAddCategory} className="mb-8 p-4 bg-white rounded shadow">
        <h3 className="text-lg font-medium mb-3">Add New Category</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm mb-1">Category Name</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="px-3 py-2 border rounded w-64"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="main">Main Category</option>
              <option value="sub">Sub Category</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </div>
      </form>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-3">Main Categories</h3>
          {mainCategories.length === 0 ? (
            <p className="text-gray-500">No main categories yet</p>
          ) : (
            <ul className="space-y-2">
              {mainCategories.map((cat) => (
                <CategoryItem key={cat._id} cat={cat} />
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-3">Sub Categories</h3>
          {subCategories.length === 0 ? (
            <p className="text-gray-500">No sub categories yet</p>
          ) : (
            <ul className="space-y-2">
              {subCategories.map((cat) => (
                <CategoryItem key={cat._id} cat={cat} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
