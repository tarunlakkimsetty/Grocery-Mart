import React from 'react';
import CartContext from '../context/CartContext';
import LanguageContext from '../context/LanguageContext';
import SearchBar from '../components/SearchBar';
import CartItem from '../components/CartItem';
import billService from '../services/billService';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../styledComponents/LayoutStyles';
import { TableWrapper, EmptyState } from '../styledComponents/FormStyles';
import { PrimaryButton, DangerButton } from '../styledComponents/ButtonStyles';

const DeliveryCheckbox = styled.input`
    cursor: pointer;
    width: 1.2rem;
    height: 1.2rem;
    accent-color: #2E7D32;
`;

const ItemRow = styled.tr`
    opacity: ${props => props.delivered ? 0.6 : 1};
    background-color: ${props => props.delivered ? '#f0f8f0' : 'transparent'};
    text-decoration: ${props => props.delivered ? 'line-through' : 'none'};
`;

class CartPage extends React.Component {
    static contextType = CartContext;

    constructor(props) {
        super(props);
        this.state = {
            paymentMethod: 'Cash',
            loading: false,
            redirectTo: null,
            searchQuery: '',
            filteredItems: [],
        };
        this.languageContext = null;
    }

    componentDidMount() {
        this.updateFilteredItems();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.context.items !== prevProps && this.state.searchQuery !== prevState.searchQuery) {
            this.updateFilteredItems();
        }
    }

    updateFilteredItems = () => {
        const { items } = this.context;
        const { searchQuery } = this.state;

        if (!searchQuery.trim()) {
            this.setState({ filteredItems: items });
            return;
        }

        const filtered = items.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        this.setState({ filteredItems: filtered });
    };

    handleSearch = (searchQuery) => {
        this.setState({ searchQuery }, this.updateFilteredItems);
    };

    handleGenerateBill = async () => {
        const cartCtx = this.context;
        const deliveredItems = cartCtx.items.filter((item) => item.delivered);

        if (deliveredItems.length === 0) {
            toast.warning(this.languageContext.getText('checkAtLeastOne'));
            return;
        }

        this.setState({ loading: true });
        try {
            const billData = {
                userId: 2,
                items: deliveredItems.map((item) => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.total,
                })),
                grandTotal: cartCtx.getDeliveredTotal(),
                paymentMethod: this.state.paymentMethod,
            };

            await billService.generateBill(billData);

            // Remove delivered items from cart
            deliveredItems.forEach((item) => {
                cartCtx.removeFromCart(item.productId);
            });

            toast.success(this.languageContext.getText('billGenerated') + ' 🎉');
            this.setState({ redirectTo: '/history' });
        } catch (err) {
            toast.error(this.languageContext.getText('billGenerationFailed'));
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        if (this.state.redirectTo) {
            return <Navigate to={this.state.redirectTo} replace />;
        }

        return (
            <LanguageContext.Consumer>
                {(langCtx) => {
                    this.languageContext = langCtx;
                    return (
                        <CartContext.Consumer>
                            {(cartCtx) => (
                                <div>
                                    <PageHeader>
                                        <h1>🛒 {langCtx.getText('shoppingCart')}</h1>
                                        <p>{cartCtx.items.length} {langCtx.getText('itemsInCart')}</p>
                                    </PageHeader>

                                    {cartCtx.items.length === 0 ? (
                                        <EmptyState>
                                            <div className="empty-icon">🛒</div>
                                            <h3>{langCtx.getText('cartEmpty')}</h3>
                                            <p>{langCtx.getText('cartEmptyMessage')}</p>
                                        </EmptyState>
                                    ) : (
                                        <>
                                            <SearchBar onSearch={this.handleSearch} />

                                            <div className="row g-4">
                                                <div className="col-12 col-lg-8">
                                                    <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#e7f3e7', borderRadius: '8px', border: '1px solid #4caf50', fontSize: '0.85rem', color: '#1b5e20' }}>
                                                        ✓ {langCtx.getText('deliveryCheckboxLabel')}
                                                    </div>

                                                    <TableWrapper>
                                                        <table className="table">
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ width: '50px', textAlign: 'center' }}>{langCtx.getText('delivered')}</th>
                                                                    <th>{langCtx.getText('productName')}</th>
                                                                    <th className="text-center">{langCtx.getText('price')}</th>
                                                                    <th className="text-center">{langCtx.getText('quantity')}</th>
                                                                    <th className="text-end">{langCtx.getText('total')}</th>
                                                                    <th className="text-center">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.state.filteredItems.map((item) => (
                                                                    <ItemRow key={item.productId} delivered={item.delivered}>
                                                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                                            <DeliveryCheckbox
                                                                                type="checkbox"
                                                                                checked={item.delivered}
                                                                                onChange={() => cartCtx.toggleItemDelivered(item.productId)}
                                                                                aria-label={`Mark ${item.name} as delivered`}
                                                                            />
                                                                        </td>
                                                                        <CartItem
                                                                            item={item}
                                                                            onUpdateQuantity={cartCtx.updateQuantity}
                                                                            onRemove={cartCtx.removeFromCart}
                                                                            isTableRow={true}
                                                                        />
                                                                    </ItemRow>
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
                                                            {langCtx.getText('billingsSummary')}
                                                        </h5>

                                                        <div style={{ background: '#f8f9fa', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                                                            <div className="d-flex justify-content-between mb-2">
                                                                <span>{langCtx.getText('totalItems')}:</span>
                                                                <span className="fw-bold">{cartCtx.items.length}</span>
                                                            </div>
                                                            <div className="d-flex justify-content-between mb-2">
                                                                <span>{langCtx.getText('deliveredItems')}:</span>
                                                                <span className="fw-bold" style={{ color: '#2E7D32' }}>
                                                                    {cartCtx.items.filter((i) => i.delivered).length}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span className="text-muted">{langCtx.getText('cartTotal')}</span>
                                                            <span>₹{cartCtx.getTotal().toFixed(2)}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-3">
                                                            <span className="text-muted">{langCtx.getText('toBill')}</span>
                                                            <span className="fw-bold" style={{ color: '#2E7D32' }}>
                                                                ₹{cartCtx.getDeliveredTotal().toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <hr />

                                                        <div className="d-flex justify-content-between mb-3">
                                                            <span className="fw-bold fs-5">{langCtx.getText('billAmount')}</span>
                                                            <span className="fw-bold fs-5" style={{ color: '#2E7D32' }}>
                                                                ₹{cartCtx.getDeliveredTotal().toFixed(2)}
                                                            </span>
                                                        </div>

                                                        <div className="mb-3">
                                                            <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>
                                                                {langCtx.getText('paymentMethod')}
                                                            </label>
                                                            <select
                                                                className="form-select"
                                                                value={this.state.paymentMethod}
                                                                onChange={(e) => this.setState({ paymentMethod: e.target.value })}
                                                            >
                                                                <option value="Cash">💵 {langCtx.getText('cash')}</option>
                                                                <option value="Card">💳 {langCtx.getText('card')}</option>
                                                                <option value="UPI">📱 {langCtx.getText('upi')}</option>
                                                            </select>
                                                        </div>

                                                        <PrimaryButton
                                                            onClick={this.handleGenerateBill}
                                                            disabled={this.state.loading || cartCtx.items.filter((i) => i.delivered).length === 0}
                                                            style={{ width: '100%', padding: '0.75rem' }}
                                                        >
                                                            {this.state.loading ? (
                                                                <>
                                                                    <span className="spinner-border spinner-border-sm me-2" />
                                                                    {langCtx.getText('processing')}
                                                                </>
                                                            ) : (
                                                                `🧾 ${langCtx.getText('generateBill')} (${cartCtx.items.filter((i) => i.delivered).length})`
                                                            )}
                                                        </PrimaryButton>

                                                        <DangerButton
                                                            onClick={cartCtx.clearCart}
                                                            style={{ width: '100%', marginTop: '0.75rem', padding: '0.65rem' }}
                                                        >
                                                            🗑️ {langCtx.getText('clearCart')}
                                                        </DangerButton>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </CartContext.Consumer>
                    );
                }}
            </LanguageContext.Consumer>
        );
    }
}

export default CartPage;
