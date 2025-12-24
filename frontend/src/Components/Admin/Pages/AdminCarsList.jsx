import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCars, removeCar } from '../../../services/carService';

const AdminCarsList = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            setLoading(true);
            const data = await getAllCars();
            setCars(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch cars');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this car?')) return;

        try {
            await removeCar(id);
            setCars(cars.filter(car => car._id !== id));
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            alert('Failed to delete car. You might not have permission.');
        }
    };

    if (loading) return <div>Loading cars...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-cars-list">
            <div className="admin-page-header">
                <h1>Manage Cars</h1>
                <Link to="/admin/cars/new" className="btn-primary">Add New Car</Link>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Brand</th>
                            <th>Model</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>Condition</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map((car) => (
                            <tr key={car._id}>
                                <td>
                                    <img
                                        src={car.image}
                                        alt={car.model}
                                        className="car-image-thumb"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/60x40?text=No+Img' }}
                                    />
                                </td>
                                <td>{car.brand}</td>
                                <td>{car.model}</td>
                                <td>{car.type}</td>
                                <td>${car.price}</td>
                                <td>{car.condition}</td>
                                <td className="actions-cell">
                                    <Link to={`/admin/cars/${car._id}/edit`} className="btn-edit">Edit</Link>
                                    <button onClick={() => handleDelete(car._id)} className="btn-danger">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {cars.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>No cars found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCarsList;
