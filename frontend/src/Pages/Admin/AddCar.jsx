import React, { useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import './AddCar.css';

const AddCar = () => {
  const [carData, setCarData] = useState({
    model: '',
    manufactureYear: '',
    brand: '',
    type: '',
    price: '',
    engineCapacity: '',
    wheelDriveType: '',
    engineType: '',
    transmissionType: ''
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isDragging, setIsDragging] = useState(false);

  const carTypes = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Hatchback', 'Van', 'Wagon'];
  const wheelDriveTypes = ['FWD', 'RWD', 'AWD', '4WD'];
  const engineTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
  const transmissionTypes = ['Manual', 'Automatic', 'CVT', 'Semi-Automatic', 'Dual-Clutch'];

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

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    
    // Filter only image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setMessage({ text: 'Please drop only image files', type: 'error' });
      return;
    }

    if (imageFiles.length + images.length > 5) {
      setMessage({ text: 'Maximum 5 images allowed', type: 'error' });
      return;
    }

    // Validate file sizes (5MB each)
    const validFiles = imageFiles.filter(file => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    // Validation
    if (!carData.model || !carData.manufactureYear || !carData.brand || !carData.type || !carData.price || !carData.engineCapacity || !carData.wheelDriveType || !carData.engineType || !carData.transmissionType) {
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
      formData.append('engineCapacity', carData.engineCapacity);
      formData.append('wheelDriveType', carData.wheelDriveType);
      formData.append('engineType', carData.engineType);
      formData.append('transmissionType', carData.transmissionType);

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
          price: '',
          engineCapacity: '',
          wheelDriveType: '',
          engineType: '',
          transmissionType: ''
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="engineCapacity">Engine Capacity (L) *</label>
              <input
                type="number"
                id="engineCapacity"
                name="engineCapacity"
                value={carData.engineCapacity}
                onChange={handleInputChange}
                placeholder="e.g., 2.5, 3.0, 5.7"
                min="0"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="wheelDriveType">Wheel Drive Type *</label>
              <select
                id="wheelDriveType"
                name="wheelDriveType"
                value={carData.wheelDriveType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Drive Type</option>
                {wheelDriveTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="engineType">Engine Type *</label>
              <select
                id="engineType"
                name="engineType"
                value={carData.engineType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Engine Type</option>
                {engineTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="transmissionType">Transmission Type *</label>
              <select
                id="transmissionType"
                name="transmissionType"
                value={carData.transmissionType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Transmission</option>
                {transmissionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
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
            <label 
              htmlFor="images" 
              className={`file-input-label ${isDragging ? 'dragging' : ''}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <span>📸 {isDragging ? 'Drop images here!' : 'Choose Images or Drag & Drop'}</span>
              <small>{images.length}/5 selected</small>
            </label>
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
