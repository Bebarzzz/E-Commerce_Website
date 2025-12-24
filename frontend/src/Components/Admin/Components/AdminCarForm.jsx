import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminCarForm = ({ initialData, onSubmit, isEdit = false }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        type: 'Sedan',
        transmission: 'Automatic',
        fuel: 'Gasoline',
        price: '',
        engineCapacity: '',
        wheelDriveType: 'FWD',
        condition: 'new', // new, used
        description: '',
        images: [] // User selected files
    });

    const [previews, setPreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                images: [] // Reset file input
            }));
            // Handle existing images for display if needed
            if (initialData.image) setExistingImages([initialData.image]);
            if (initialData.images) setExistingImages(initialData.images);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            images: files
        }));

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Build FormData
        const data = new FormData();
        data.append('brand', formData.brand);
        data.append('model', formData.model);
        data.append('manufactureYear', formData.year); // Map year to manufactureYear
        data.append('type', formData.type);
        data.append('transmissionType', formData.transmission); // Map transmission to transmissionType
        data.append('engineType', formData.fuel); // Map fuel to engineType
        data.append('price', formData.price);
        data.append('engineCapacity', formData.engineCapacity);
        data.append('wheelDriveType', formData.wheelDriveType);
        data.append('condition', formData.condition);
        data.append('description', formData.description);

        // Append images
        // Note: Backend expectation depends on implementation (images vs image)
        // Assuming backend handles 'images' array or multiple 'image' fields
        formData.images.forEach((file) => {
            data.append('images', file);
        });

        // If existing images need to be preserved or handled, that logic depends on backend.
        // Usually backend handles "if new images, replace old" or "add to old".
        // For this implementation we send what we have.

        try {
            await onSubmit(data);
            navigate('/admin/cars');
        } catch (err) {
            setError(err.message || 'Failed to save car');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-form-container">
            {error && <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="brand">Brand</label>
                    <input
                        type="text"
                        id="brand"
                        name="brand"
                        className="form-control"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="model">Model</label>
                    <input
                        type="text"
                        id="model"
                        name="model"
                        className="form-control"
                        value={formData.model}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label htmlFor="year">Manufacture Year</label>
                        <input
                            type="number"
                            id="year"
                            name="year"
                            className="form-control"
                            value={formData.year}
                            onChange={handleChange}
                            min="1900"
                            max={new Date().getFullYear()}
                            required
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label htmlFor="price">Price ($)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            className="form-control"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Type</label>
                        <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Truck">Truck</option>
                            <option value="Coupe">Coupe</option>
                            <option value="Convertible">Convertible</option>
                            <option value="Van">Van</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Condition</label>
                        <select name="condition" className="form-control" value={formData.condition} onChange={handleChange} required>
                            <option value="new">New</option>
                            <option value="used">Used</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Transmission Type</label>
                        <select name="transmission" className="form-control" value={formData.transmission} onChange={handleChange} required>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                            <option value="CVT">CVT</option>
                            <option value="Semi-Automatic">Semi-Automatic</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Engine Type</label>
                        <select name="fuel" className="form-control" value={formData.fuel} onChange={handleChange} required>
                            <option value="Gasoline">Gasoline</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Engine Capacity (L)</label>
                        <input
                            type="number"
                            name="engineCapacity"
                            className="form-control"
                            value={formData.engineCapacity}
                            onChange={handleChange}
                            min="0.1"
                            step="0.1"
                            placeholder="e.g., 2.0, 3.5"
                            required
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Wheel Drive Type</label>
                        <select name="wheelDriveType" className="form-control" value={formData.wheelDriveType} onChange={handleChange} required>
                            <option value="FWD">FWD (Front-Wheel Drive)</option>
                            <option value="RWD">RWD (Rear-Wheel Drive)</option>
                            <option value="AWD">AWD (All-Wheel Drive)</option>
                            <option value="4WD">4WD (Four-Wheel Drive)</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter car description (optional)"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="images">Images (Max 5)</label>
                    <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        className="form-file-input"
                        onChange={handleImageChange}
                        // Required only on create if no existing images (simplified logic here)
                        required={!isEdit}
                    />
                    <div className="image-previews">
                        {previews.map((src, idx) => (
                            <img key={idx} src={src} alt="Preview" className="preview-img" />
                        ))}
                        {isEdit && previews.length === 0 && existingImages.map((src, idx) => (
                            <img key={`exist-${idx}`} src={src} alt="Existing" className="preview-img" style={{ opacity: 0.7 }} />
                        ))}
                    </div>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (isEdit ? 'Update Car' : 'create Car')}
                </button>
            </form>
        </div>
    );
};

export default AdminCarForm;
