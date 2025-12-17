import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App'
import { toast } from 'react-toastify';

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
  const [loading, setLoading] = useState(false)

  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const defaultMainCategories = ['Men', 'Women', 'Kids'];
  const defaultSubCategories = ['Topwear', 'Bottomwear', 'Winterwear'];

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
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div className='grid grid-flow-row-dense grid-cols-2 grid-rows-2 gap-8'>
          <label htmlFor="image1" className='col-span-1 cursor-pointer'>
            <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input onChange={(e)=> setImage1(e.target.files[0])} type="file" id='image1' hidden />
          </label>
          <label htmlFor="image2" className='col-span-1 cursor-pointer'>
            <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
            <input onChange={(e)=> setImage2(e.target.files[0])} type="file" id='image2' hidden />
          </label>
          <label htmlFor="image3" className='cursor-pointer'>
            <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
            <input onChange={(e)=> setImage3(e.target.files[0])} type="file" id='image3' hidden />
          </label>
          <label htmlFor="image4" className='cursor-pointer'>
            <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
            <input onChange={(e)=> setImage4(e.target.files[0])} type="file" id='image4' hidden />
          </label>
        </div>

    <div className='w-full'>
      <p className='mb-2'>Product name</p>
      <input onChange={(e)=> setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 border' type="text" placeholder='Type here' required/>
    </div>
    <div className='w-full'>
      <p className='mb-2'>Product description</p>
      <textarea onChange={(e)=> setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 border' placeholder='Write description here' required/>
    </div>
    <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

      <div>
        <p className='mb-2'>Product category</p>
        <select onChange={(e)=> setCategory(e.target.value)} value={category} className='w-full px-3 py-2 border'>
          {mainCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <p className='mb-2'>Sub category</p>
        <select onChange={(e)=> setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2 border'>
          {subCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <p className='mb-2'>Product price</p>
        <input onChange={(e)=> setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px] border' type="number" placeholder="25" required />
      </div>
    </div>

    <div>
      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3'>
          <div onClick={()=>setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev, "S"])}>
            <p className={`${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>S</p>
          </div>
          <div onClick={()=>setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev, "M"])}>
            <p className={`${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>M</p>
          </div>
          <div onClick={()=>setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev, "L"])}>
            <p className={`${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>L</p>
          </div>
          <div onClick={()=>setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev, "XL"])}>
            <p className={`${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XL</p>
          </div>
          <div onClick={()=>setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev, "XXL"])}>
            <p className={`${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XXL</p>
          </div>
        </div>
      </div>
    </div>
    <div className='flex gap-2 mt-2'>
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller'/>
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>
    <button type="submit" disabled={loading} className='w-28 py-3 mt-4 bg-black text-white disabled:opacity-50'>
      {loading ? 'Adding...' : 'ADD'}
    </button>
    </form>
  )
}

export default Add;
