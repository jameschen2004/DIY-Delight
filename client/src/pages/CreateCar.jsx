import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCustomItem } from '../services/CustomItemsAPI';
import { calculateTotalPrice, checkFeatureCombination } from '../utilities/priceAndValidation';
import { BASE_PRICE, FEATURE_OPTIONS } from '../utilities/constants';
import '../App.css';

const CreateCar = () => {
    const navigate = useNavigate();
    
    // Set initial state using default selections and calculated price
    const initialSelections = {
        item_name: 'My Custom Car',
        item_type: 'Car',
        feature_one_selection: FEATURE_OPTIONS.feature_one[0].name, 
        feature_two_selection: FEATURE_OPTIONS.feature_two[0].name,
        user_notes: '',
    };
    
    const [formState, setFormState] = useState({
        ...initialSelections,
        price: calculateTotalPrice(initialSelections)
    });
    
    const [price, setPrice] = useState(formState.price);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    // Dynamic Price Calculation using the utility function (REQUIRED FEATURE)
    useEffect(() => {
        const newPrice = calculateTotalPrice(formState);
        setPrice(newPrice);
        // Keep formState.price in sync for submission
        setFormState(prev => ({ ...prev, price: newPrice })); 
    }, [formState.feature_one_selection, formState.feature_two_selection]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    // Placeholder function for dynamic visualization (REQUIRED FEATURE)
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage({ type: '', text: 'Submitting...' });
        
        // 1. Check for impossible combo using the utility function (REQUIRED FEATURE)
        const validationResult = checkFeatureCombination(formState);
        if (validationResult) {
             // Appropriate error message (REQUIRED FEATURE)
            setStatusMessage({ type: 'error', text: validationResult.message });
            return; // Item should not be saved
        }
        
        try {
            const newItem = await createCustomItem(formState);
            setStatusMessage({ type: 'success', text: `Item "${newItem.item_name}" created successfully!` });
            setTimeout(() => navigate(`/cars/${newItem.id}`), 1500);
        } catch (err) {
            // This catches server-side validation (like the DB constraint)
            setStatusMessage({ type: 'error', text: 'Submission Error: ' + (err.message || 'Check console.') });
            console.error(err);
        }
    };

    return (
        <div className="create-car-container">
            <h1 className="page-title">⚙️ Design Your DIY Delight (Base Price: ${BASE_PRICE})</h1>
            
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

                    <button type="submit" className="button submit-button">Save Custom Item</button>
                </form>
            </div>
        </div>
    );
};

export default CreateCar;