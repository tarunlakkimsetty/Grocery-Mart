import React from 'react';
import productService from '../services/productService';
import { toast } from 'react-toastify';
import { PageHeader } from '../styledComponents/LayoutStyles';
import { FormWrapper } from '../styledComponents/FormStyles';
import { PrimaryButton, SecondaryButton } from '../styledComponents/ButtonStyles';

const CATEGORIES = [
    { value: 'grains', label: 'Grains, Rice & Pulses' },
    { value: 'milk', label: 'Milk & Dairy' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'spices', label: 'Spices' },
    { value: 'oils', label: 'Oils' },
    { value: 'condiments', label: 'Condiments' },
    { value: 'cleaning', label: 'Cleaning Supplies' },
    { value: 'personal', label: 'Personal Care & Hygiene' },
];

class AddProductPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            category: 'grains',
            price: '',
            stock: '',
            unit: 'pack',
            emoji: '📦',
            errors: {},
            loading: false,
            success: false,
        };
    }

    validate = () => {
        const errors = {};
        const { name, price, stock } = this.state;

        if (!name.trim()) errors.name = 'Product name is required';
        if (!price || parseFloat(price) <= 0) errors.price = 'Enter a valid price';
        if (!stock || parseInt(stock) < 0) errors.stock = 'Enter a valid stock quantity';

        this.setState({ errors });
        return Object.keys(errors).length === 0;
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        if (!this.validate()) return;

        this.setState({ loading: true });
        try {
            const { name, category, price, stock, unit, emoji } = this.state;
            await productService.addProduct({
                name,
                category,
                price: parseFloat(price),
                stock: parseInt(stock),
                unit,
                emoji,
            });
            toast.success('Product added successfully! 🎉');
            this.setState({
                name: '',
                price: '',
                stock: '',
                unit: 'pack',
                emoji: '📦',
                errors: {},
                success: true,
            });
            setTimeout(() => this.setState({ success: false }), 3000);
        } catch (err) {
            toast.error('Failed to add product');
        } finally {
            this.setState({ loading: false });
        }
    };

    handleChange = (field) => (e) => {
        this.setState({ [field]: e.target.value });
    };

    render() {
        const { name, category, price, stock, unit, emoji, errors, loading, success } = this.state;

        return (
            <div>
                <PageHeader>
                    <h1>➕ Add New Product</h1>
                    <p>Add a product to the inventory</p>
                </PageHeader>

                <div className="row">
                    <div className="col-12 col-lg-8 col-xl-6">
                        <FormWrapper>
                            <div className="form-title">📦 Product Details</div>

                            {success && (
                                <div className="alert alert-success py-2" style={{ fontSize: '0.875rem' }}>
                                    ✅ Product added successfully!
                                </div>
                            )}

                            <form onSubmit={this.handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Product Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        value={name}
                                        onChange={this.handleChange('name')}
                                        placeholder="e.g. Basmati Rice (5kg)"
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>

                                <div className="row mb-3">
                                    <div className="col-8">
                                        <label className="form-label fw-semibold">Category</label>
                                        <select
                                            className="form-select"
                                            value={category}
                                            onChange={this.handleChange('category')}
                                        >
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-4">
                                        <label className="form-label fw-semibold">Emoji</label>
                                        <input
                                            type="text"
                                            className="form-control text-center"
                                            value={emoji}
                                            onChange={this.handleChange('emoji')}
                                            style={{ fontSize: '1.5rem' }}
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-4">
                                        <label className="form-label fw-semibold">Price (₹)</label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                            value={price}
                                            onChange={this.handleChange('price')}
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                                    </div>
                                    <div className="col-4">
                                        <label className="form-label fw-semibold">Stock</label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
                                            value={stock}
                                            onChange={this.handleChange('stock')}
                                            min="0"
                                            placeholder="0"
                                        />
                                        {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
                                    </div>
                                    <div className="col-4">
                                        <label className="form-label fw-semibold">Unit</label>
                                        <select
                                            className="form-select"
                                            value={unit}
                                            onChange={this.handleChange('unit')}
                                        >
                                            <option value="pack">Pack</option>
                                            <option value="kg">Kg</option>
                                            <option value="litre">Litre</option>
                                            <option value="bottle">Bottle</option>
                                            <option value="piece">Piece</option>
                                            <option value="jar">Jar</option>
                                            <option value="tube">Tube</option>
                                            <option value="can">Can</option>
                                            <option value="packet">Packet</option>
                                            <option value="cup">Cup</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <PrimaryButton type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Adding...
                                            </>
                                        ) : (
                                            '➕ Add Product'
                                        )}
                                    </PrimaryButton>
                                    <SecondaryButton
                                        type="button"
                                        onClick={() =>
                                            this.setState({
                                                name: '',
                                                price: '',
                                                stock: '',
                                                unit: 'pack',
                                                emoji: '📦',
                                                errors: {},
                                            })
                                        }
                                    >
                                        Clear
                                    </SecondaryButton>
                                </div>
                            </form>
                        </FormWrapper>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddProductPage;
