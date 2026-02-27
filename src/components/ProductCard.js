import React from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { toast } from 'react-toastify';
import {
    ProductCardWrapper,
    CardImage,
    CardBody,
    CardActions,
} from '../styledComponents/CardStyles';
import { PrimaryButton, SecondaryButton, WarningButton } from '../styledComponents/ButtonStyles';
import { ModalOverlay, ModalContent } from '../styledComponents/FormStyles';

const CATEGORY_GRADIENTS = {
    grains: 'linear-gradient(135deg, #fff8e1, #ffecb3)',
    milk: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
    snacks: 'linear-gradient(135deg, #fce4ec, #f8bbd0)',
    spices: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
    oils: 'linear-gradient(135deg, #f1f8e9, #dcedc8)',
    condiments: 'linear-gradient(135deg, #fbe9e7, #ffccbc)',
    cleaning: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)',
    personal: 'linear-gradient(135deg, #f3e5f5, #e1bee7)',
};

class ProductCard extends React.Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            quantity: 1,
            showEditModal: false,
            editPrice: props.product.price,
            editStock: props.product.stock,
        };
    }

    handleAddToCart = (cartCtx) => {
        const { product } = this.props;
        const qty = parseInt(this.state.quantity);
        if (qty < 1 || qty > product.stock) {
            toast.warning('Please enter a valid quantity');
            return;
        }
        cartCtx.addToCart(product, qty);
        toast.success(`${product.name} added to cart!`);
        this.setState({ quantity: 1 });
    };

    handleSaveEdit = () => {
        const { product, onUpdateProduct } = this.props;
        if (onUpdateProduct) {
            onUpdateProduct(product.id, {
                price: parseFloat(this.state.editPrice),
                stock: parseInt(this.state.editStock),
            });
        }
        this.setState({ showEditModal: false });
        toast.success('Product updated successfully!');
    };

    render() {
        const { product } = this.props;
        const { role } = this.context;
        const isAdmin = role === 'admin';
        const gradient = CATEGORY_GRADIENTS[product.category] || CATEGORY_GRADIENTS.grains;

        return (
            <>
                <ProductCardWrapper>
                    <CardImage $bg={gradient} $inStock={product.stock > 0}>
                        <span>{product.emoji || '📦'}</span>
                        <span className="stock-badge">
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                    </CardImage>
                    <CardBody>
                        <div className="card-title">{product.name}</div>
                        <div className="card-category">{product.category}</div>
                        <div className="card-price">
                            ₹{product.price} <span className="unit">/{product.unit || 'unit'}</span>
                        </div>
                    </CardBody>
                    <CardActions>
                        {isAdmin ? (
                            <>
                                <WarningButton onClick={() => this.setState({ showEditModal: true, editPrice: product.price, editStock: product.stock })}>
                                    ✏️ Edit
                                </WarningButton>
                            </>
                        ) : (
                            <>
                                <input
                                    type="number"
                                    className="qty-input"
                                    min="1"
                                    max={product.stock}
                                    value={this.state.quantity}
                                    onChange={(e) => this.setState({ quantity: e.target.value })}
                                    disabled={product.stock <= 0}
                                />
                                <CartContext.Consumer>
                                    {(cartCtx) => (
                                        <PrimaryButton
                                            onClick={() => this.handleAddToCart(cartCtx)}
                                            disabled={product.stock <= 0}
                                        >
                                            🛒 Add
                                        </PrimaryButton>
                                    )}
                                </CartContext.Consumer>
                            </>
                        )}
                    </CardActions>
                </ProductCardWrapper>

                {/* Edit Modal for Admin */}
                {this.state.showEditModal && (
                    <ModalOverlay onClick={() => this.setState({ showEditModal: false })}>
                        <ModalContent onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Edit Product</h3>
                                <button className="close-btn" onClick={() => this.setState({ showEditModal: false })}>×</button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Product Name</label>
                                    <input type="text" className="form-control" value={product.name} readOnly disabled />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Price (₹)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={this.state.editPrice}
                                        onChange={(e) => this.setState({ editPrice: e.target.value })}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Stock</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={this.state.editStock}
                                        onChange={(e) => this.setState({ editStock: e.target.value })}
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <SecondaryButton onClick={() => this.setState({ showEditModal: false })}>Cancel</SecondaryButton>
                                <PrimaryButton onClick={this.handleSaveEdit}>Save Changes</PrimaryButton>
                            </div>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </>
        );
    }
}

export default ProductCard;
