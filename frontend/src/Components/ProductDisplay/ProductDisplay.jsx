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
        {product.condition && (
          <div className={`condition-badge ${product.condition}`}>
            {product.condition === 'new' ? '🆕 New Car' : '🚗 Used Car'}
          </div>
        )}
        <div className="productdisplay-right-prices">
            <div className="productdisplay-right-price-old">${product.old_price}</div>
            <div className="productdisplay-right-price-new">${product.new_price}</div>
        </div>
        <div className="productdisplay-right-description">
            Experience the thrill of the road with this exceptional vehicle. Combining performance, comfort, and style, it's designed to elevate your driving experience.
        </div>
        
        {/* Car Specifications */}
        {(product.engineCapacity || product.wheelDriveType || product.engineType || product.transmissionType) && (
          <div className="productdisplay-specifications">
            <h3>Specifications</h3>
            <div className="specs-grid">
              {product.engineCapacity && (
                <div className="spec-item">
                  <span className="spec-label">Engine Capacity:</span>
                  <span className="spec-value">{product.engineCapacity}L</span>
                </div>
              )}
              {product.engineType && (
                <div className="spec-item">
                  <span className="spec-label">Engine Type:</span>
                  <span className="spec-value">{product.engineType}</span>
                </div>
              )}
              {product.wheelDriveType && (
                <div className="spec-item">
                  <span className="spec-label">Drive Type:</span>
                  <span className="spec-value">{product.wheelDriveType}</span>
                </div>
              )}
              {product.transmissionType && (
                <div className="spec-item">
                  <span className="spec-label">Transmission:</span>
                  <span className="spec-value">{product.transmissionType}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
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
