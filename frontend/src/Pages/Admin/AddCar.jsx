import React, { useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import './AddCar.css';

const AddCar = () => {
  const [carData, setCarData] = useState({
    model: '',
    manufactureYear: '',
    brand: '',
    type: '',
    price: ''
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const carTypes = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Hatchback', 'Van', 'Wagon'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      setMessage({ text: 'Maximum 5 images allowed', type: 'error' });
      return;
    }

    // Validate file sizes (5MB each)
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: `${file.name} is too large. Max size is 5MB`, type: 'error' });
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    // Validation
    if (!carData.model || !carData.manufactureYear || !carData.brand || !carData.type || !carData.price) {
      setMessage({ text: 'All fields are required', type: 'error' });
      setLoading(false);
      return;
    }

    if (images.length === 0) {
      setMessage({ text: 'Please add at least one image', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('model', carData.model);
      formData.append('manufactureYear', carData.manufactureYear);
      formData.append('brand', carData.brand);
      formData.append('type', carData.type);
      formData.append('price', carData.price);

      // Append all images
      images.forEach((image) => {
        formData.append('images', image);
      });

      const token = localStorage.getItem('token');
      
      const response = await fetch(API_ENDPOINTS.ADD_CAR, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: 'Car added successfully!', type: 'success' });
        // Reset form
        setCarData({
          model: '',
          manufactureYear: '',
          brand: '',
          type: '',
          price: ''
        });
        setImages([]);
        setImagePreviews([]);
      } else {
        setMessage({ text: data.error || 'Failed to add car', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error. Please try again.', type: 'error' });
      console.error('Error adding car:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-car-container">
      <div className="add-car-card">
        <h1 className="add-car-title">Add New Car</h1>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-car-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={carData.brand}
                onChange={handleInputChange}
                placeholder="e.g., Toyota, BMW, Ford"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="model">Model *</label>
              <input
                type="text"
                id="model"
                name="model"
                value={carData.model}
                onChange={handleInputChange}
                placeholder="e.g., Camry, 3 Series, F-150"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="manufactureYear">Manufacture Year *</label>
              <input
                type="number"
                id="manufactureYear"
                name="manufactureYear"
                value={carData.manufactureYear}
                onChange={handleInputChange}
                placeholder="e.g., 2023"
                min="1900"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Type *</label>
              <select
                id="type"
                name="type"
                value={carData.type}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Type</option>
                {carTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={carData.price}
              onChange={handleInputChange}
              placeholder="e.g., 25000"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="images">Car Images * (Max 5, 5MB each)</label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="file-input"
            />
            <div className="file-input-label">
              <span>📸 Choose Images</span>
              <small>{images.length}/5 selected</small>
            </div>
          </div>

          {imagePreviews.length > 0 && (
            <div className="image-previews">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview">
                  <img src={preview} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Adding Car...' : 'Add Car'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCar;
