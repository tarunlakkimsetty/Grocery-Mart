import React from 'react';
import { DangerButton, GhostButton } from '../styledComponents/ButtonStyles';
import LanguageContext from '../context/LanguageContext';
import { toast } from 'react-toastify';

class CartItem extends React.Component {
    static contextType = LanguageContext;

    render() {
        const { item, onUpdateQuantity, onRemove } = this.props;
        const langCtx = this.context;

        const handleIncrease = () => {
            if (item.quantity >= item.stock) {
                toast.warning(langCtx.getText('stockLimitReached'));
                return;
            }
            onUpdateQuantity(item.productId, item.quantity + 1);
        };

        const handleDecrease = () => {
            if (item.quantity <= 1) {
                return;
            }
            onUpdateQuantity(item.productId, item.quantity - 1);
        };

        const isIncreaseDisabled = item.quantity >= item.stock;
        const isDecreaseDisabled = item.quantity <= 1;

        return (
            <tr>
                <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
                        <span className="fw-semibold">{item.name}</span>
                    </div>
                </td>
                <td className="text-center">₹{item.price.toFixed(2)}</td>
                <td className="text-center">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <GhostButton
                            onClick={handleDecrease}
                            disabled={isDecreaseDisabled}
                            style={{
                                padding: '0.2rem 0.5rem',
                                minWidth: '30px',
                                opacity: isDecreaseDisabled ? 0.5 : 1,
                                cursor: isDecreaseDisabled ? 'not-allowed' : 'pointer'
                            }}
                            title={isDecreaseDisabled ? 'Quantity cannot be less than 1' : 'Decrease quantity'}
                        >
                            −
                        </GhostButton>
                        <span className="fw-bold" style={{ minWidth: '30px', textAlign: 'center' }}>
                            {item.quantity}
                        </span>
                        <GhostButton
                            onClick={handleIncrease}
                            disabled={isIncreaseDisabled}
                            style={{
                                padding: '0.2rem 0.5rem',
                                minWidth: '30px',
                                opacity: isIncreaseDisabled ? 0.5 : 1,
                                cursor: isIncreaseDisabled ? 'not-allowed' : 'pointer'
                            }}
                            title={isIncreaseDisabled ? `Stock limit reached (${item.stock} available)` : 'Increase quantity'}
                        >
                            +
                        </GhostButton>
                    </div>
                    {isIncreaseDisabled && (
                        <div style={{ fontSize: '0.75rem', color: '#E53935', marginTop: '0.25rem' }}>
                            Max: {item.stock}
                        </div>
                    )}
                </td>
                <td className="text-end fw-bold" style={{ color: '#2E7D32' }}>₹{item.total.toFixed(2)}</td>
                <td className="text-center">
                    <DangerButton
                        onClick={() => onRemove(item.productId)}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        title={langCtx.getText('removeItem')}
                    >
                        ✕
                    </DangerButton>
                </td>
            </tr>
        );
    }
}

export default CartItem;
