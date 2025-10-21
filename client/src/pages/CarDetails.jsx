import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCustomItemById, deleteCustomItem } from '../services/CustomItemsAPI';
import '../App.css'; 

const CarDetails = () => {
    const { carId } = useParams(); // Get the ID from the URL (e.g., /cars/1)
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Placeholder function for dynamic visualization
    const renderVisual = (featureOne) => {
        const style = {
            width: '150px',
            height: '150px',
            borderRadius: '10px',
            backgroundColor: featureOne.toLowerCase() || 'lightgray', // Changes based on color
            border: '2px solid black',
            transition: 'background-color 0.3s'
        };
        return <div style={style} className="item-visual-icon"></div>;
    };

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const data = await getCustomItemById(carId);
                setItem(data);
            } catch (err) {
                setError('Failed to load item details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [carId]);

    // Handle deletion from the detail page (REQUIRED FEATURE)
    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${item.item_name}?`)) {
            try {
                await deleteCustomItem(carId);
                alert('Item deleted successfully!');
                navigate('/cars'); // Redirect to the list view
            } catch (err) {
                setError('Error deleting item: ' + (err.message || 'Check console.'));
            }
        }
    };

    if (loading) return <h2 className="loading-message">Loading Details...</h2>;
    if (error) return <h2 className="error-message">{error}</h2>;
    if (!item) return <h2 className="error-message">Item not found.</h2>;

    return (
        <div className="car-details-container">
            <h1 className="page-title">{item.item_name} Details</h1>
            <div className="details-content">
                <div className="item-visualization">
                    <h2>Visual Representation (Changes with Exterior Color)</h2>
                    {/* Visual Interface changes in response to at least one customizable feature (REQUIRED FEATURE) */}
                    {renderVisual(item.feature_one_selection)}
                </div>
                
                <div className="item-specifications">
                    <p><strong>Item Type:</strong> {item.item_type}</p>
                    {/* View multiple features (REQUIRED FEATURE) */}
                    <p><strong>Feature 1 (Exterior Color):</strong> {item.feature_one_selection}</p>
                    <p><strong>Feature 2 (Wheel Style):</strong> {item.feature_two_selection}</p>
                    <p><strong>User Notes:</strong> {item.user_notes || 'None'}</p>
                    <p><strong>Submitted On:</strong> {new Date(item.submitted_on).toLocaleDateString()}</p>
                    <h3 className="final-price">Final Price: ${parseFloat(item.price).toFixed(2)}</h3>
                </div>
            </div>

            <div className="action-buttons">
                {/* Link to edit page (REQUIRED FEATURE) */}
                <Link to={`/edit/${item.id}`} className="button edit-button">Edit Item</Link>
                {/* Delete button (REQUIRED FEATURE) */}
                <button onClick={handleDelete} className="button delete-button">Delete Item</button>
                <Link to="/cars" className="button back-button">Back to List</Link>
            </div>
        </div>
    );
};

export default CarDetails;