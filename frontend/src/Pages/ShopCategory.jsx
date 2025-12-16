import React, { useContext, useState } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/ShopContext'
import Item from '../Components/Item/Item'
import SearchBar from '../Components/SearchBar/SearchBar'

const ShopCategory = (props) => {
  const { all_product, loading, error } = useContext(ShopContext);
  const [sortType, setSortType] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return <div style={{textAlign: 'center', padding: '50px'}}>Loading products...</div>
  }

  if (error) {
    return <div style={{textAlign: 'center', padding: '50px', color: 'red'}}>Error loading products: {error}</div>
  }

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
      {props.banner && <img className='shopcategory-banner' src={props.banner} alt="" />}
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
        {sortedProducts.length > 0 ? (
          sortedProducts.map((item, i) => {
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
          })
        ) : (
          <div style={{textAlign: 'center', width: '100%', padding: '50px'}}>
            No products found in this category.
          </div>
        )}
      </div>
      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  )
}

export default ShopCategory