import React from 'react';
import billService from '../services/billService';
import productService from '../services/productService';
import Spinner from '../components/Spinner';
import { PageHeader } from '../styledComponents/LayoutStyles';
import { StatsCard } from '../styledComponents/CardStyles';

class AnalyticsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bills: [],
            products: [],
            loading: true,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        try {
            const [bills, products] = await Promise.all([
                billService.getAllBills(),
                productService.getProducts(),
            ]);
            this.setState({ bills, products, loading: false });
        } catch {
            this.setState({ loading: false });
        }
    };

    getTopProducts = () => {
        const productSales = {};
        this.state.bills.forEach((bill) => {
            bill.items.forEach((item) => {
                if (!productSales[item.name]) {
                    productSales[item.name] = { name: item.name, quantity: 0, revenue: 0 };
                }
                productSales[item.name].quantity += item.quantity;
                productSales[item.name].revenue += item.total;
            });
        });
        return Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
    };

    getCategorySales = () => {
        const catMap = {};
        this.state.products.forEach((p) => {
            if (!catMap[p.category]) catMap[p.category] = { count: 0, totalStock: 0 };
            catMap[p.category].count++;
            catMap[p.category].totalStock += p.stock;
        });
        return catMap;
    };

    render() {
        const { bills, products, loading } = this.state;
        if (loading) return <Spinner fullPage text="Loading analytics..." />;

        const totalRevenue = bills.reduce((s, b) => s + b.grandTotal, 0);
        const avgOrderValue = bills.length > 0 ? totalRevenue / bills.length : 0;
        const topProducts = this.getTopProducts();
        const categorySales = this.getCategorySales();

        const CATEGORY_NAMES = {
            grains: 'Grains & Pulses',
            milk: 'Milk & Dairy',
            snacks: 'Snacks',
            spices: 'Spices',
            oils: 'Oils',
            condiments: 'Condiments',
            cleaning: 'Cleaning',
            personal: 'Personal Care',
        };

        return (
            <div>
                <PageHeader>
                    <h1>📊 Analytics Dashboard</h1>
                    <p>Business insights and performance metrics</p>
                </PageHeader>

                {/* Stats Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-6 col-lg-3">
                        <StatsCard $gradient="linear-gradient(135deg, #2E7D32, #66BB6A)">
                            <div className="stats-icon">💰</div>
                            <div className="stats-value">₹{totalRevenue.toFixed(0)}</div>
                            <div className="stats-label">Total Revenue</div>
                        </StatsCard>
                    </div>
                    <div className="col-6 col-lg-3">
                        <StatsCard $gradient="linear-gradient(135deg, #1565C0, #42A5F5)">
                            <div className="stats-icon">🧾</div>
                            <div className="stats-value">{bills.length}</div>
                            <div className="stats-label">Total Bills</div>
                        </StatsCard>
                    </div>
                    <div className="col-6 col-lg-3">
                        <StatsCard $gradient="linear-gradient(135deg, #E65100, #FF9800)">
                            <div className="stats-icon">📦</div>
                            <div className="stats-value">{products.length}</div>
                            <div className="stats-label">Total Products</div>
                        </StatsCard>
                    </div>
                    <div className="col-6 col-lg-3">
                        <StatsCard $gradient="linear-gradient(135deg, #7B1FA2, #BA68C8)">
                            <div className="stats-icon">📈</div>
                            <div className="stats-value">₹{avgOrderValue.toFixed(0)}</div>
                            <div className="stats-label">Avg Order Value</div>
                        </StatsCard>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Top Products */}
                    <div className="col-12 col-lg-6">
                        <div style={{ background: 'white', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', border: '1px solid #e9ecef', height: '100%' }}>
                            <h5 className="fw-bold mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                🏆 Top Selling Products
                            </h5>
                            {topProducts.length === 0 ? (
                                <p className="text-muted">No sales data yet</p>
                            ) : (
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th style={{ fontSize: '0.8rem' }}>#</th>
                                            <th style={{ fontSize: '0.8rem' }}>Product</th>
                                            <th style={{ fontSize: '0.8rem' }} className="text-center">Qty Sold</th>
                                            <th style={{ fontSize: '0.8rem' }} className="text-end">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topProducts.map((p, i) => (
                                            <tr key={i}>
                                                <td className="fw-bold">{i + 1}</td>
                                                <td>{p.name}</td>
                                                <td className="text-center">{p.quantity}</td>
                                                <td className="text-end fw-bold" style={{ color: '#2E7D32' }}>
                                                    ₹{p.revenue.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Category Overview */}
                    <div className="col-12 col-lg-6">
                        <div style={{ background: 'white', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', border: '1px solid #e9ecef', height: '100%' }}>
                            <h5 className="fw-bold mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                📊 Category Overview
                            </h5>
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th style={{ fontSize: '0.8rem' }}>Category</th>
                                        <th style={{ fontSize: '0.8rem' }} className="text-center">Products</th>
                                        <th style={{ fontSize: '0.8rem' }} className="text-center">Total Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(categorySales).map(([cat, data]) => (
                                        <tr key={cat}>
                                            <td>{CATEGORY_NAMES[cat] || cat}</td>
                                            <td className="text-center">{data.count}</td>
                                            <td className="text-center">{data.totalStock}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment Method Breakdown */}
                    <div className="col-12 col-lg-6">
                        <div style={{ background: 'white', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', border: '1px solid #e9ecef' }}>
                            <h5 className="fw-bold mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                💳 Payment Methods
                            </h5>
                            {(() => {
                                const methods = {};
                                bills.forEach((b) => {
                                    if (!methods[b.paymentMethod]) methods[b.paymentMethod] = { count: 0, total: 0 };
                                    methods[b.paymentMethod].count++;
                                    methods[b.paymentMethod].total += b.grandTotal;
                                });
                                return (
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th style={{ fontSize: '0.8rem' }}>Method</th>
                                                <th style={{ fontSize: '0.8rem' }} className="text-center">Orders</th>
                                                <th style={{ fontSize: '0.8rem' }} className="text-end">Revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(methods).map(([method, data]) => (
                                                <tr key={method}>
                                                    <td>
                                                        {method === 'Cash' ? '💵' : method === 'Card' ? '💳' : '📱'} {method}
                                                    </td>
                                                    <td className="text-center">{data.count}</td>
                                                    <td className="text-end fw-bold" style={{ color: '#2E7D32' }}>
                                                        ₹{data.total.toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    <div className="col-12 col-lg-6">
                        <div style={{ background: 'white', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', border: '1px solid #e9ecef' }}>
                            <h5 className="fw-bold mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                ⚠️ Low Stock Alert
                            </h5>
                            {(() => {
                                const lowStock = products.filter((p) => p.stock < 30).sort((a, b) => a.stock - b.stock);
                                if (lowStock.length === 0) {
                                    return <p className="text-muted">All products are well stocked!</p>;
                                }
                                return (
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th style={{ fontSize: '0.8rem' }}>Product</th>
                                                <th style={{ fontSize: '0.8rem' }} className="text-center">Stock</th>
                                                <th style={{ fontSize: '0.8rem' }} className="text-end">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lowStock.slice(0, 8).map((p) => (
                                                <tr key={p.id}>
                                                    <td>{p.emoji} {p.name}</td>
                                                    <td className="text-center">
                                                        <span style={{
                                                            color: p.stock < 10 ? '#c62828' : '#e65100',
                                                            fontWeight: '700',
                                                        }}>
                                                            {p.stock}
                                                        </span>
                                                    </td>
                                                    <td className="text-end">₹{p.price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AnalyticsPage;
