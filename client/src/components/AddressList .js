import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, deleteAddress, updateAddress } from '@/redux/slices/addressSlice';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const AddressList = () => {
    const dispatch = useDispatch();
    const { loading, error, addresses } = useSelector((state) => state.address);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        dispatch(fetchAddresses());
    }, [dispatch]);

    const handleDelete = useCallback(async (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await dispatch(deleteAddress(id)).unwrap();
                dispatch(fetchAddresses());
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    }, [dispatch]);

    const handleEditClick = useCallback((address) => {
        setIsEditing(true);
        setCurrentAddress(address);
        setFormData({ ...address });
    }, []);

    const handleFormChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }, []);

    const handleUpdate = useCallback(async () => {
        try {
            await dispatch(updateAddress({ id: currentAddress._id, ...formData })).unwrap();
            dispatch(fetchAddresses());
            setIsEditing(false);
            setCurrentAddress(null);
        } catch (error) {
            console.error('Update failed:', error);
        }
    }, [currentAddress, formData, dispatch]);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        setCurrentAddress(null);
    }, []);

    const addressList = useMemo(() => 
        addresses?.map((address) => (
            <div key={address._id} className="border border-gray-200 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-2">
                    <p className="font-medium text-lg">{address.fullName}</p>
                    <p className="text-gray-600">{address.street}</p>
                    <p className="text-gray-600">{address.city}, {address.state} {address.zipCode}</p>
                    <p className="text-gray-600">{address.country}</p>
                    <p className="text-gray-600">Phone: {address.phone}</p>
                    {address.isDefault && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                            Default Address
                        </span>
                    )}
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={() => handleEditClick(address)}
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                        aria-label="Edit address"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => handleDelete(address._id)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        aria-label="Delete address"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        ))
    , [addresses, handleEditClick, handleDelete]);

    const editForm = useMemo(() => {
        if (!isEditing) return null;
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Edit Address</h2>
                        <button 
                            onClick={handleCancel}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Close edit form"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName || ''}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleFormChange}
                            placeholder="Phone"
                            className="w-full px-4 py-2 border rounded"
                        />
                        <input
                            type="text"
                            name="street"
                            value={formData.street || ''}
                            onChange={handleFormChange}
                            placeholder="Street"
                            className="w-full px-4 py-2 border rounded"
                        />
                        <input
                            type="text"
                            name="city"
                            value={formData.city || ''}
                            onChange={handleFormChange}
                            placeholder="City"
                            className="w-full px-4 py-2 border rounded"
                        />
                        <input
                            type="text"
                            name="state"
                            value={formData.state || ''}
                            onChange={handleFormChange}
                            placeholder="State"
                            className="w-full px-4 py-2 border rounded"
                        />
                        <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode || ''}
                            onChange={handleFormChange}
                            placeholder="Zip Code"
                            className="w-full px-4 py-2 border rounded"
                        />
                        <input
                            type="text"
                            name="country"
                            value={formData.country || ''}
                            onChange={handleFormChange}
                            placeholder="Country"
                            className="w-full px-4 py-2 border rounded"
                        />
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isDefault"
                                checked={formData.isDefault || false}
                                onChange={handleFormChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">Set as default address</label>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleUpdate}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }, [isEditing, formData, handleFormChange, handleCancel, handleUpdate]);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Your Addresses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addressList}
            </div>
            {editForm}
        </div>
    );
};

export default React.memo(AddressList);