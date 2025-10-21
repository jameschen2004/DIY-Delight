import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomItemById, updateCustomItem } from '../services/CustomItemsAPI';
import { calculateTotalPrice, checkFeatureCombination } from '../utilities/priceAndValidation';
import { BASE_PRICE, FEATURE_OPTIONS } from '../utilities/constants';
import '../App.css';

const EditCar = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const [formState, setFormState] = useState(null);
    const [price, setPrice] = useState(BASE_PRICE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    // 1. Fetch initial data for editing
    useEffect(() => {
        const fetchItem = async () => {
            try {
                const data = await getCustomItemById(carId);
                // Initialize form state with existing data
                setFormState(data); 
                // Set initial price using the utility function
                setPrice(calculateTotalPrice(data));
            } catch (err) {
                setError('Failed to load item for editing.');
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [carId]);

    // 2. Dynamic Price Calculation (REQUIRED FEATURE)
    useEffect(() => {
        if (formState) {
            // Recalculate price whenever relevant features change
            const newPrice = calculateTotalPrice(formState);
            setPrice(newPrice);
            setFormState(prev => ({ ...prev, price: newPrice }));
        }
    }, [formState?.feature_one_selection, formState?.feature_two_selection]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    // Placeholder for visual (REQUIRED FEATURE)
    const renderVisual = (featureOne) => {
        const style = {
            width: '150px',
            height: '150px',
            borderRadius: '10px',
            backgroundColor: featureOne.toLowerCase() || 'lightgray',
            border: '2px solid black',
            transition: 'background-color 0.3s'
        };
        return <div style={style} className="item-visual-icon"></div>;
    };

    // 3. Handle Update (REQUIRED FEATURE)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage({ type: '', text: 'Updating...' });
        
        // Check for impossible combo using the utility function (REQUIRED FEATURE)
        const validationResult = checkFeatureCombination(formState);
        if (validationResult) {
            setStatusMessage({ type: 'error', text: validationResult.message });
            return; // Stop submission
        }
        
        try {
            const updatedItem = await updateCustomItem(carId, formState); 
            setStatusMessage({ type: 'success', text: `Item "${updatedItem.item_name}" updated successfully!` });
            setTimeout(() => navigate(`/cars/${updatedItem.id}`), 1500);
        } catch (err) {
            setStatusMessage({ type: 'error', text: 'Update Error: ' + (err.message || 'Check console.') });
            console.error(err);
        }
    };

    if (loading) return <h2 className="loading-message">Loading Item...</h2>;
    if (error) return <h2 className="error-message">{error}</h2>;
    if (!formState) return <h2 className="error-message">Item not found.</h2>;


    return (
        <div className="edit-car-container">
            <h1 className="page-title">✏️ Edit: {formState.item_name}</h1>
            
            <div className="customization-area">
                
                <div className="visualization-panel">
                    <h2>Live Preview (Exterior Color: {formState.feature_one_selection})</h2>
                    {renderVisual(formState.feature_one_selection)}
                    <h3 className="dynamic-price">Current Total Price: ${parseFloat(price).toFixed(2)}</h3>
                    {statusMessage.text && (
                        <p className={`status-message ${statusMessage.type}`}>{statusMessage.text}</p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="customization-form">
                    
                    <label>
                        Item Name:
                        <input
                            type="text"
                            name="item_name"
                            value={formState.item_name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    
                    {/* Feature 1: Exterior Color */}
                    <fieldset>
                        <legend>Feature 1: Exterior Color</legend>
                        {FEATURE_OPTIONS.feature_one.map(option => (
                            <label key={option.name}>
                                <input
                                    type="radio"
                                    name="feature_one_selection"
                                    value={option.name}
                                    checked={formState.feature_one_selection === option.name}
                                    onChange={handleChange}
                                />
                                {option.name} (+${option.price})
                            </label>
                        ))}
                    </fieldset>

                    {/* Feature 2: Wheel Style */}
                    <fieldset>
                        <legend>Feature 2: Wheel Style</legend>
                        {FEATURE_OPTIONS.feature_two.map(option => (
                            <label key={option.name}>
                                <input
                                    type="radio"
                                    name="feature_two_selection"
                                    value={option.name}
                                    checked={formState.feature_two_selection === option.name}
                                    onChange={handleChange}
                                />
                                {option.name} (+${option.price})
                            </label>
                        ))}
                    </fieldset>
                    
                    <label>
                        User Notes:
                        <textarea
                            name="user_notes"
                            value={formState.user_notes}
                            onChange={handleChange}
                        />
                    </label>

                    <button type="submit" className="button submit-button">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

export default EditCar;