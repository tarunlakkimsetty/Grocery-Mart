import React from 'react';
import CartContext from '../context/CartContext';
import CartItem from '../components/CartItem';
import billService from '../services/billService';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import { PageHeader } from '../styledComponents/LayoutStyles';
import { TableWrapper, EmptyState } from '../styledComponents/FormStyles';
import { PrimaryButton, DangerButton } from '../styledComponents/ButtonStyles';

class CartPage extends React.Component {
    static contextType = CartContext;

    constructor(props) {
        super(props);
        this.state = {
            paymentMethod: 'Cash',
            loading: false,
            redirectTo: null,
        };
    }

    handleGenerateBill = async () => {
        const cartCtx = this.context;
        if (cartCtx.items.length === 0) {
            toast.warning('Cart is empty!');
            return;
        }

        this.setState({ loading: true });
        try {
            const billData = {
                userId: 2, // will be replaced from AuthContext
                items: cartCtx.items.map((item) => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.total,
                })),
                grandTotal: cartCtx.getTotal(),
                paymentMethod: this.state.paymentMethod,
            };

            await billService.generateBill(billData);
            cartCtx.clearCart();
            toast.success('Bill generated successfully! 🎉');
            this.setState({ redirectTo: '/history' });
        } catch (err) {
            toast.error('Failed to generate bill');
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        if (this.state.redirectTo) {
            return <Navigate to={this.state.redirectTo} replace />;
        }

        return (
            <CartContext.Consumer>
                {(cartCtx) => (
                    <div>
                        <PageHeader>
                            <h1>🛒 Shopping Cart</h1>
                            <p>{cartCtx.items.length} item(s) in your cart</p>
                        </PageHeader>

                        {cartCtx.items.length === 0 ? (
                            <EmptyState>
                                <div className="empty-icon">🛒</div>
                                <h3>Your Cart is Empty</h3>
                                <p>Browse products and add items to your cart to get started.</p>
                            </EmptyState>
                        ) : (
                            <div className="row g-4">
                                <div className="col-12 col-lg-8">
                                    <TableWrapper>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th className="text-center">Price</th>
                                                    <th className="text-center">Quantity</th>
                                                    <th className="text-end">Total</th>
                                                    <th className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartCtx.items.map((item) => (
                                                    <CartItem
                                                        key={item.productId}
                                                        item={item}
                                                        onUpdateQuantity={cartCtx.updateQuantity}
                                                        onRemove={cartCtx.removeFromCart}
                                                    />
                                                ))}
                                            </tbody>
                                        </table>
                                    </TableWrapper>
                                </div>

                                <div className="col-12 col-lg-4">
                                    <div style={{
                                        background: 'white',
                                        borderRadius: '10px',
                                        padding: '1.5rem',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                                        border: '1px solid #e9ecef',
                                        position: 'sticky',
                                        top: '80px',
                                    }}>
                                        <h5 className="fw-bold mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                            Order Summary
                                        </h5>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Items ({cartCtx.items.length})</span>
                                            <span>₹{cartCtx.getTotal().toFixed(2)}</span>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between mb-3">
                                            <span className="fw-bold fs-5">Grand Total</span>
                                            <span className="fw-bold fs-5" style={{ color: '#2E7D32' }}>
                                                ₹{cartCtx.getTotal().toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>
                                                Payment Method
                                            </label>
                                            <select
                                                className="form-select"
                                                value={this.state.paymentMethod}
                                                onChange={(e) => this.setState({ paymentMethod: e.target.value })}
                                            >
                                                <option value="Cash">💵 Cash</option>
                                                <option value="Card">💳 Card</option>
                                                <option value="UPI">📱 UPI</option>
                                            </select>
                                        </div>

                                        <PrimaryButton
                                            onClick={this.handleGenerateBill}
                                            disabled={this.state.loading}
                                            style={{ width: '100%', padding: '0.75rem' }}
                                        >
                                            {this.state.loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" />
                                                    Processing...
                                                </>
                                            ) : (
                                                '🧾 Generate Bill'
                                            )}
                                        </PrimaryButton>

                                        <DangerButton
                                            onClick={cartCtx.clearCart}
                                            style={{ width: '100%', marginTop: '0.75rem', padding: '0.65rem' }}
                                        >
                                            🗑️ Clear Cart
                                        </DangerButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CartContext.Consumer>
        );
    }
}

export default CartPage;
