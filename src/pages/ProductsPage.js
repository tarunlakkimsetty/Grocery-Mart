import React from 'react';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { PageHeader } from '../styledComponents/LayoutStyles';
import { EmptyState } from '../styledComponents/FormStyles';

const CATEGORY_NAMES = {
    grains: 'Grains, Rice & Pulses',
    milk: 'Milk & Dairy',
    snacks: 'Snacks',
    spices: 'Spices',
    oils: 'Oils',
    condiments: 'Condiments',
    cleaning: 'Cleaning Supplies',
    personal: 'Personal Care & Hygiene',
};

class ProductsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            loading: true,
            error: null,
        };
    }

    componentDidMount() {
        this.fetchProducts();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.activeCategory !== this.props.activeCategory) {
            this.fetchProducts();
        }
    }

    fetchProducts = async () => {
        this.setState({ loading: true, error: null });
        try {
            const products = await productService.getProducts(this.props.activeCategory || null);
            this.setState({ products, loading: false });
        } catch (err) {
            this.setState({ error: 'Failed to load products', loading: false });
            toast.error('Failed to load products');
        }
    };

    handleUpdateProduct = async (id, data) => {
        try {
            await productService.updateProduct(id, data);
            this.fetchProducts();
        } catch (err) {
            toast.error('Failed to update product');
        }
    };

    render() {
        const { activeCategory } = this.props;
        const { products, loading, error } = this.state;
        const title = activeCategory
            ? CATEGORY_NAMES[activeCategory] || activeCategory
            : 'All Products';

        return (
            <div>
                <PageHeader>
                    <h1>{title}</h1>
                    <p>{products.length} products available</p>
                </PageHeader>

                {loading && <Spinner fullPage text="Loading products..." />}

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <EmptyState>
                        <div className="empty-icon">📦</div>
                        <h3>No Products Found</h3>
                        <p>There are no products in this category yet.</p>
                    </EmptyState>
                )}

                {!loading && !error && products.length > 0 && (
                    <div className="row g-3">
                        {products.map((product) => (
                            <div key={product.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                                <ProductCard
                                    product={product}
                                    onUpdateProduct={this.handleUpdateProduct}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default ProductsPage;
