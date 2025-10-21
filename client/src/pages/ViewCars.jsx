import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCustomItems, deleteCustomItem } from '../services/CustomItemsAPI';
import '../App.css'; // Assuming this imports your global styles

const ViewCars = () => {
    const [customItems, setCustomItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the list of custom items
    const fetchItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllCustomItems();
            setCustomItems(data);
        } catch (err) {
            setError('Failed to fetch custom items.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Handle deletion of a custom item
    const handleDelete = async (itemId, itemName) => {
        if (window.confirm(`Are you sure you want to delete the custom item: ${itemName}?`)) {
            try {
                await deleteCustomItem(itemId);
                // After successful deletion, refresh the list
                setCustomItems(prevItems => prevItems.filter(item => item.id !== itemId));
            } catch (err) {
                alert('Error deleting item: ' + (err.message || 'Check console.'));
                console.error(err);
            }
        }
    };

    if (loading) return <h2 className="loading-message">Loading Custom Items...</h2>;
    if (error) return <h2 className="error-message">{error}</h2>;

    return (
        <div className="view-cars-container">
            <h1 className="page-title">🚗 Your DIY Delights (All Items)</h1>
            {customItems.length === 0 ? (
                <p>No custom items created yet. <Link to="/create">Start personalizing!</Link></p>
            ) : (
                <div className="item-list">
                    {customItems.map(item => (
                        <div key={item.id} className="item-card">
                            <h2>{item.item_name} ({item.item_type})</h2>
                            <p><strong>Exterior:</strong> {item.feature_one_selection}</p>
                            <p><strong>Wheels:</strong> {item.feature_two_selection}</p>
                            <p className="item-price">Total Price: ${parseFloat(item.price).toFixed(2)}</p>
                            <div className="item-actions">
                                {/* Link to view details (and edit/delete from detail page) */}
                                <Link to={`/cars/${item.id}`} className="button view-button">View Details</Link>
                                {/* Button to delete directly from the list (REQUIRED FEATURE) */}
                                <button 
                                    onClick={() => handleDelete(item.id, item.item_name)}
                                    className="button delete-button"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewCars;