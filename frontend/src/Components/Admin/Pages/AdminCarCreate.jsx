import React from 'react';
import AdminCarForm from '../Components/AdminCarForm';
import { addCar } from '../../../services/carService';

const AdminCarCreate = () => {
    const handleSubmit = async (formData) => {
        await addCar(formData);
    };

    return (
        <div className="admin-car-create">
            <div className="admin-page-header">
                <h1>Add New Car</h1>
            </div>
            <AdminCarForm onSubmit={handleSubmit} isEdit={false} />
        </div>
    );
};

export default AdminCarCreate;
