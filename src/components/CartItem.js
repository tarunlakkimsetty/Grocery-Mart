import React from 'react';
import { DangerButton, GhostButton } from '../styledComponents/ButtonStyles';

class CartItem extends React.Component {
    render() {
        const { item, onUpdateQuantity, onRemove } = this.props;

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
                            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                            style={{ padding: '0.2rem 0.5rem', minWidth: '30px' }}
                        >
                            −
                        </GhostButton>
                        <span className="fw-bold" style={{ minWidth: '30px', textAlign: 'center' }}>
                            {item.quantity}
                        </span>
                        <GhostButton
                            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                            style={{ padding: '0.2rem 0.5rem', minWidth: '30px' }}
                        >
                            +
                        </GhostButton>
                    </div>
                </td>
                <td className="text-end fw-bold" style={{ color: '#2E7D32' }}>₹{item.total.toFixed(2)}</td>
                <td className="text-center">
                    <DangerButton
                        onClick={() => onRemove(item.productId)}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                    >
                        ✕
                    </DangerButton>
                </td>
            </tr>
        );
    }
}

export default CartItem;
