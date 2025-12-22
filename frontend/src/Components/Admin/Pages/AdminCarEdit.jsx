import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminCarForm from '../Components/AdminCarForm';
import { getCarById, editCar } from '../../../services/carService';

const AdminCarEdit = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchCar = async () => {
        try {
            setLoading(true);
            const data = await getCarById(id);
            setCar(data);
        } catch (err) {
            setError('Failed to fetch car details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        await editCar(id, formData);
    };

    if (loading) return <div>Loading car details...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-car-edit">
            <div className="admin-page-header">
                <h1>Edit Car</h1>
            </div>
            {car && <AdminCarForm initialData={car} onSubmit={handleSubmit} isEdit={true} />}
        </div>
    );
};

export default AdminCarEdit;
