import React, { useState } from 'react'
import './AddProduct.css'

const AddProduct = () => {

    const [productDetails, setProductDetails] = useState({
        model: "",
        manufactureYear: "",
        brand: "",
        type: "",
        price: ""
    });

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value })
    }

    const Add_Product = async () => {
        // Convert price and year to numbers
        const product = {
            ...productDetails,
            price: Number(productDetails.price),
            manufactureYear: Number(productDetails.manufactureYear)
        };

        await fetch('http://localhost:4000/api/car/add', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        }).then((resp) => resp.json()).then((data) => {
            if (data.model) { 
                alert("Product Added Successfully");
                setProductDetails({
                    model: "",
                    manufactureYear: "",
                    brand: "",
                    type: "",
                    price: ""
                });
            } else {
                alert("Failed to add product");
            }
        }).catch((err) => console.error(err));
    }

    return (
        <div className='add-product'>
            <h2>Add New Car</h2>
            <div className="addproduct-itemfield">
                <p>Car Model</p>
                <input value={productDetails.model} onChange={changeHandler} type="text" name='model' placeholder='Type here' />
            </div>
            <div className="addproduct-itemfield">
                <p>Brand</p>
                <input value={productDetails.brand} onChange={changeHandler} type="text" name='brand' placeholder='Type here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.price} onChange={changeHandler} type="number" name='price' placeholder='Type here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Year</p>
                    <input value={productDetails.manufactureYear} onChange={changeHandler} type="number" name='manufactureYear' placeholder='Type here' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Type</p>
                <select value={productDetails.type} onChange={changeHandler} name="type" className='add-product-selector'>
                    <option value="" disabled>Select Type</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck</option>
                    <option value="Coupe">Coupe</option>
                </select>
            </div>
            <button onClick={Add_Product} className='addproduct-btn'>ADD</button>
        </div>
    )
}

export default AddProduct