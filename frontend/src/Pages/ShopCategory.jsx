import React, { useContext, useState } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/ShopContext'
import Item from '../Components/Item/Item'
import SearchBar from '../Components/SearchBar/SearchBar'

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [sortType, setSortType] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryProducts = all_product.filter(item => {
    const isCategoryMatch = item.category === props.category;
    const isSearchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return isCategoryMatch && isSearchMatch;
  });

  const sortedProducts = [...categoryProducts].sort((a, b) => {
    if (sortType === 'price-low') return a.new_price - b.new_price;
    if (sortType === 'price-high') return b.new_price - a.new_price;
    return 0;
  });

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <SearchBar onSearch={setSearchQuery} />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-{sortedProducts.length}</span> out of {sortedProducts.length} products
        </p>
        <div className="shopcategory-sort">
          <select onChange={(e) => setSortType(e.target.value)} className="sort-dropdown">
            <option value="default">Sort by</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
      <div className="shopcategory-products">
        {sortedProducts.map((item, i) => {
          return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
        })}
      </div>
      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  )
}

export default ShopCategory