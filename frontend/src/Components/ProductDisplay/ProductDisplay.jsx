import React, { useContext, useState } from 'react'
import './ProductDisplay.css'
import { ShopContext } from '../../Context/ShopContext';
import { NotificationContext } from '../../Context/NotificationContext';

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const { notify } = useContext(NotificationContext);
  
  // Get all images from product, fallback to single image if images array not available
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];
  
  const [mainImage, setMainImage] = useState(productImages[0]);

  return (
    <div className='productdisplay'>
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {productImages.map((img, index) => (
            <img 
              key={index} 
              src={img} 
              alt={`${product.name} view ${index + 1}`} 
              onClick={() => setMainImage(img)}
              className={mainImage === img ? 'active' : ''}
            />
          ))}
          {/* Fill remaining slots if less than 4 images */}
          {productImages.length < 4 && Array(4 - productImages.length).fill(null).map((_, index) => (
            <div key={`placeholder-${index}`} className="productdisplay-img-placeholder"></div>
          ))}
        </div>
        <div className="productdisplay-img">
          <img className='productdisplay-main-img' src={mainImage} alt={product.name} />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-prices">
          {product.old_price && product.old_price !== product.new_price && (
            <div className="productdisplay-right-price-old">${product.old_price}</div>
          )}
          <div className="productdisplay-right-price-new">${product.new_price}</div>
        </div>
        <div className="productdisplay-right-description">
          Experience the thrill of the road with this exceptional vehicle. Combining performance, comfort, and style, it's designed to elevate your driving experience.
        </div>
        <div className="productdisplay-right-actions">
          <button onClick={() => {
            addToCart(product.id);
            notify('Item added to cart!', 'success');
          }}>ADD TO CART</button>
        </div>
        <p className='productdisplay-right-category'><span>Category :</span> {product.category}</p>
        {product.type && <p className='productdisplay-right-category'><span>Type :</span> {product.type}</p>}
        {product.engineType && <p className='productdisplay-right-category'><span>Engine :</span> {product.engineType}</p>}
        {product.transmissionType && <p className='productdisplay-right-category'><span>Transmission :</span> {product.transmissionType}</p>}
        {product.engineCapacity && <p className='productdisplay-right-category'><span>Engine Capacity :</span> {product.engineCapacity}L</p>}
        {product.wheelDriveType && <p className='productdisplay-right-category'><span>Drive Type :</span> {product.wheelDriveType}</p>}
      </div>
    </div>
  )
}

export default ProductDisplay
