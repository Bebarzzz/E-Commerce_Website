import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Product = () => {
  const {all_product, loading} = useContext(ShopContext);
  const {productId} = useParams();
  
  if (loading) {
    return <div style={{textAlign: 'center', padding: '50px'}}>Loading...</div>
  }
  
  const product = all_product.find((e)=> e.id === productId);
  
  if(!product) {
    return <div style={{textAlign: 'center', padding: '50px'}}>Product not found</div>
  }

  return (
    <div>
      <Breadcrum product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox description={product.description}/>
      <RelatedProducts/>
    </div>
  )
}

export default Product