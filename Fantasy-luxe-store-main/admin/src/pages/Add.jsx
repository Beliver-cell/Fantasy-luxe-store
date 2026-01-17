import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App'
import { toast } from 'react-toastify';

const compressImage = (file, maxSize = 1200, quality = 0.85) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;
        
        const size = Math.min(width, height, maxSize);
        
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, size, size);
        
        const cropX = (width - Math.min(width, height)) / 2;
        const cropY = (height - Math.min(width, height)) / 2;
        const cropSize = Math.min(width, height);
        
        ctx.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, size, size);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

const Add = ({token}) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [colors, setColors] = useState([])
  const [customSize, setCustomSize] = useState("")
  const [customColor, setCustomColor] = useState("")
  const [loading, setLoading] = useState(false)

  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const defaultMainCategories = ['Men', 'Women', 'Kids'];
  const defaultSubCategories = ['Topwear', 'Bottomwear', 'Winterwear'];
  const defaultSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const defaultColors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Pink', 'Brown', 'Gray'];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/category/list');
        if (response.data.success && response.data.categories.length > 0) {
          const main = response.data.categories.filter(c => c.type === 'main').map(c => c.name);
          const sub = response.data.categories.filter(c => c.type === 'sub').map(c => c.name);
          setMainCategories(main.length > 0 ? main : defaultMainCategories);
          setSubCategories(sub.length > 0 ? sub : defaultSubCategories);
          if (main.length > 0) setCategory(main[0]);
          if (sub.length > 0) setSubCategory(sub[0]);
        } else {
          setMainCategories(defaultMainCategories);
          setSubCategories(defaultSubCategories);
          setCategory(defaultMainCategories[0]);
          setSubCategory(defaultSubCategories[0]);
        }
      } catch (error) {
        setMainCategories(defaultMainCategories);
        setSubCategories(defaultSubCategories);
        setCategory(defaultMainCategories[0]);
        setSubCategory(defaultSubCategories[0]);
      }
    };
    fetchCategories();
  }, []);

  const toggleSize = (size) => {
    setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const toggleColor = (color) => {
    setColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

  const addCustomSize = () => {
    if (customSize.trim() && !sizes.includes(customSize.trim())) {
      setSizes(prev => [...prev, customSize.trim()]);
      setCustomSize("");
    }
  };

  const addCustomColor = () => {
    if (customColor.trim() && !colors.includes(customColor.trim())) {
      setColors(prev => [...prev, customColor.trim()]);
      setCustomColor("");
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim() || !price) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!image1 && !image2 && !image3 && !image4) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category || mainCategories[0] || 'Men')
      formData.append("subCategory", subCategory || subCategories[0] || 'Topwear')
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))
      formData.append("colors", JSON.stringify(colors))

      if (image1) formData.append("image1", image1)
      if (image2) formData.append("image2", image2)
      if (image3) formData.append("image3", image3)
      if (image4) formData.append("image4", image4)

      const response = await axios.post(backendUrl + "/api/product/add", formData, {headers: {token}})
      if(response.data.success){
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
        setSizes([])
        setColors([])
        setBestseller(false)
      }
      else{
        toast.error(response.data.message)
      }
    }
    catch (error){
      console.error(error);
      toast.error(error.response?.data?.message || error.message)
    }
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3 p-4 md:p-0'>
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          <label htmlFor="image1" className='cursor-pointer'>
            <img className='w-16 sm:w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input onChange={async (e) => { if (e.target.files[0]) setImage1(await compressImage(e.target.files[0])); }} type="file" id='image1' hidden accept="image/*" />
          </label>
          <label htmlFor="image2" className='cursor-pointer'>
            <img className='w-16 sm:w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
            <input onChange={async (e) => { if (e.target.files[0]) setImage2(await compressImage(e.target.files[0])); }} type="file" id='image2' hidden accept="image/*" />
          </label>
          <label htmlFor="image3" className='cursor-pointer'>
            <img className='w-16 sm:w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
            <input onChange={async (e) => { if (e.target.files[0]) setImage3(await compressImage(e.target.files[0])); }} type="file" id='image3' hidden accept="image/*" />
          </label>
          <label htmlFor="image4" className='cursor-pointer'>
            <img className='w-16 sm:w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
            <input onChange={async (e) => { if (e.target.files[0]) setImage4(await compressImage(e.target.files[0])); }} type="file" id='image4' hidden accept="image/*" />
          </label>
        </div>

    <div className='w-full'>
      <p className='mb-2'>Product name</p>
      <input onChange={(e)=> setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 border rounded' type="text" placeholder='Type here' required/>
    </div>
    <div className='w-full'>
      <p className='mb-2'>Product description</p>
      <textarea onChange={(e)=> setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 border rounded min-h-[100px]' placeholder='Write description here' required/>
    </div>
    <div className='flex flex-col sm:flex-row gap-4 w-full'>

      <div className='flex-1'>
        <p className='mb-2'>Product category</p>
        <select onChange={(e)=> setCategory(e.target.value)} value={category} className='w-full px-3 py-2 border rounded'>
          {mainCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className='flex-1'>
        <p className='mb-2'>Sub category</p>
        <select onChange={(e)=> setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2 border rounded'>
          {subCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className='flex-1'>
        <p className='mb-2'>Product price</p>
        <input onChange={(e)=> setPrice(e.target.value)} value={price} className='w-full px-3 py-2 border rounded' type="number" placeholder="25" required />
      </div>
    </div>

    <div className='w-full'>
      <p className='mb-2'>Product Sizes</p>
      <div className='flex flex-wrap gap-2 mb-2'>
        {defaultSizes.map(size => (
          <div key={size} onClick={() => toggleSize(size)}>
            <p className={`${sizes.includes(size) ? "bg-pink-100 border-pink-300" : "bg-slate-200"} px-3 py-1 cursor-pointer border rounded`}>{size}</p>
          </div>
        ))}
      </div>
      <div className='flex gap-2 items-center'>
        <input
          value={customSize}
          onChange={(e) => setCustomSize(e.target.value)}
          className='px-3 py-1 border rounded w-32'
          placeholder='Custom size (e.g. 41)'
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSize())}
        />
        <button type="button" onClick={addCustomSize} className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300'>Add</button>
      </div>
      {sizes.filter(s => !defaultSizes.includes(s)).length > 0 && (
        <div className='flex flex-wrap gap-2 mt-2'>
          {sizes.filter(s => !defaultSizes.includes(s)).map(size => (
            <div key={size} onClick={() => toggleSize(size)} className='flex items-center gap-1 bg-pink-100 border border-pink-300 px-2 py-1 rounded cursor-pointer'>
              <span>{size}</span>
              <span className='text-red-500'>x</span>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className='w-full'>
      <p className='mb-2'>Product Colors</p>
      <div className='flex flex-wrap gap-2 mb-2'>
        {defaultColors.map(color => (
          <div key={color} onClick={() => toggleColor(color)}>
            <p className={`${colors.includes(color) ? "bg-blue-100 border-blue-300" : "bg-slate-200"} px-3 py-1 cursor-pointer border rounded`}>{color}</p>
          </div>
        ))}
      </div>
      <div className='flex gap-2 items-center'>
        <input
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          className='px-3 py-1 border rounded w-32'
          placeholder='Custom color'
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomColor())}
        />
        <button type="button" onClick={addCustomColor} className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300'>Add</button>
      </div>
      {colors.filter(c => !defaultColors.includes(c)).length > 0 && (
        <div className='flex flex-wrap gap-2 mt-2'>
          {colors.filter(c => !defaultColors.includes(c)).map(color => (
            <div key={color} onClick={() => toggleColor(color)} className='flex items-center gap-1 bg-blue-100 border border-blue-300 px-2 py-1 rounded cursor-pointer'>
              <span>{color}</span>
              <span className='text-red-500'>x</span>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className='flex gap-2 mt-2'>
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller'/>
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>
    <button type="submit" disabled={loading} className='w-full sm:w-28 py-3 mt-4 bg-black text-white disabled:opacity-50 rounded'>
      {loading ? 'Adding...' : 'ADD'}
    </button>
    </form>
  )
}

export default Add;
