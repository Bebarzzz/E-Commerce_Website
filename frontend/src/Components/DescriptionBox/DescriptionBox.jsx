import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = ({description}) => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
      </div>
      <div className="descriptionbox-description">
        <p>
          {description ? description : "Detailed information about this vehicle will be available soon. This section will include specifications, features, and condition reports."}
        </p>
      </div>
    </div>
  )
}

export default DescriptionBox
