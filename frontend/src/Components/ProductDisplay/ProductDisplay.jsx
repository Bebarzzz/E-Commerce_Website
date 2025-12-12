import React, { useContext, useState } from 'react'
import './ProductDisplay.css'
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const {product} = props;
    const {addToCart} = useContext(ShopContext);
    const [mainImage, setMainImage] = useState(product.image);

  return (
    <div className='productdisplay'>
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
            <img src={product.image} alt="" onClick={()=>setMainImage(product.image)} />
            <img src={product.image} alt="" onClick={()=>setMainImage(product.image)} />
            <img src={product.image} alt="" onClick={()=>setMainImage(product.image)} />
            <img src={product.image} alt="" onClick={()=>setMainImage(product.image)} />
        </div>
        <div className="productdisplay-img">
            <img className='productdisplay-main-img' src={mainImage} alt="" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-prices">
            <div className="productdisplay-right-price-old">${product.old_price}</div>
            <div className="productdisplay-right-price-new">${product.new_price}</div>
        </div>
        <div className="productdisplay-right-description">
            Experience the thrill of the road with this exceptional vehicle. Combining performance, comfort, and style, it's designed to elevate your driving experience.
        </div>
        <div className="productdisplay-right-actions">
          <button onClick={()=>{addToCart(product.id)}}>ADD TO CART</button>
        </div>
        <p className='productdisplay-right-category'><span>Category :</span> {product.category}, Automotive</p>
        <p className='productdisplay-right-category'><span>Tags :</span> Modern, Reliable</p>
      </div>
    </div>
  )
}

export default ProductDisplay
