import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import LanguageContext from '../context/LanguageContext';
import billService from '../services/billService';
import orderService from '../services/orderService';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { PageHeader } from '../styledComponents/LayoutStyles';
import { TableWrapper, PaginationWrapper, EmptyState, Badge } from '../styledComponents/FormStyles';

const ITEMS_PER_PAGE = 10;

class BillHistoryPage extends React.Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            bills: [],
            orders: [],
            loading: true,
            error: null,
            currentPage: 1,
            redirectTo: null,
            activeTab: 'bills',
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        this.setState({ loading: true });
        try {
            const { user } = this.context;
            const userId = user ? user.id : 2;
            const [bills, orders] = await Promise.all([
                billService.getBillHistory(userId),
                orderService.getUserOrders(userId),
            ]);
            this.setState({ bills, orders, loading: false });
        } catch (err) {
            this.setState({ error: 'Failed to load history', loading: false });
            toast.error('Failed to load history');
        }
    };

    formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    getPaymentBadge = (method) => {
        const map = { Cash: 'badge-success', Card: 'badge-info', UPI: 'badge-warning' };
        return map[method] || 'badge-info';
    };

    getStatusBadge = (status) => {
        const map = { Pending: 'badge-warning', Verified: 'badge-info', Delivered: 'badge-success' };
        return map[status] || 'badge-warning';
    };

    render() {
        if (this.state.redirectTo) {
            return <Navigate to={this.state.redirectTo} />;
        }

        const { bills, orders, loading, error, currentPage, activeTab } = this.state;

        const activeList = activeTab === 'bills' ? bills : orders;
        const totalPages = Math.ceil(activeList.length / ITEMS_PER_PAGE);
        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        const visibleItems = activeList.slice(startIdx, startIdx + ITEMS_PER_PAGE);

        return (
            <LanguageContext.Consumer>
                {(langCtx) => (
                    <div>
                        <PageHeader>
                            <h1>📋 {langCtx.getText('purchaseHistory')}</h1>
                            <p>{bills.length + orders.length} {langCtx.getText('items')} total transactions</p>
                        </PageHeader>

                        {loading && <Spinner fullPage text="Loading history..." />}
                        {error && <div className="alert alert-danger">{error}</div>}

                        {!loading && !error && (
                            <>
                                {/* Tabs */}
                                <ul className="nav nav-tabs mb-3">
                                    <li className="nav-item">
                                        <button
                                            className={'nav-link' + (activeTab === 'bills' ? ' active fw-bold' : '')}
                                            onClick={() => this.setState({ activeTab: 'bills', currentPage: 1 })}
                                        >
                                            🧾 {langCtx.getText('bills')} ({bills.length})
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={'nav-link' + (activeTab === 'orders' ? ' active fw-bold' : '')}
                                            onClick={() => this.setState({ activeTab: 'orders', currentPage: 1 })}
                                        >
                                            🛵 {langCtx.getText('onlineOrders')} ({orders.length})
                                        </button>
                                    </li>
                                </ul>

                                {/* Bills Tab */}
                                {activeTab === 'bills' && bills.length === 0 && (
                                    <EmptyState>
                                        <div className="empty-icon">🧾</div>
                                        <h3>{langCtx.getText('noBills')}</h3>
                                        <p>{langCtx.getText('noBillsMessage')}</p>
                                    </EmptyState>
                                )}

                                {activeTab === 'bills' && bills.length > 0 && (
                                    <TableWrapper $clickable>
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>{langCtx.getText('billNumber')}</th>
                                                    <th>{langCtx.getText('billDate')}</th>
                                                    <th>{langCtx.getText('items')}</th>
                                                    <th>{langCtx.getText('paymentMethod')}</th>
                                                    <th className="text-end">{langCtx.getText('total')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {visibleItems.map((bill) => (
                                                    <tr
                                                        key={bill.id}
                                                        onClick={() => this.setState({ redirectTo: `/bill/${bill.id}` })}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <td className="fw-bold">#{bill.id}</td>
                                                        <td>{this.formatDate(bill.date)}</td>
                                                        <td>{bill.items.length} {langCtx.getText('items')}</td>
                                                        <td>
                                                            <Badge className={this.getPaymentBadge(bill.paymentMethod)}>
                                                                {bill.paymentMethod}
                                                            </Badge>
                                                        </td>
                                                        <td className="text-end fw-bold" style={{ color: '#2E7D32' }}>
                                                            ₹{bill.grandTotal.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {totalPages > 1 && this.renderPagination(langCtx, currentPage, totalPages)}
                                    </TableWrapper>
                                )}

                                {/* Online Orders Tab */}
                                {activeTab === 'orders' && orders.length === 0 && (
                                    <EmptyState>
                                        <div className="empty-icon">🛵</div>
                                        <h3>{langCtx.getText('noOrders')}</h3>
                                        <p>{langCtx.getText('noOrdersMessage')}</p>
                                    </EmptyState>
                                )}

                                {activeTab === 'orders' && orders.length > 0 && (
                                    <TableWrapper>
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>{langCtx.getText('orderId')}</th>
                                                    <th>{langCtx.getText('orderDate')}</th>
                                                    <th>{langCtx.getText('items')}</th>
                                                    <th>{langCtx.getText('paymentMethod')}</th>
                                                    <th>{langCtx.getText('orderStatus')}</th>
                                                    <th className="text-end">{langCtx.getText('total')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {visibleItems.map((order) => (
                                                    <tr key={order.id}>
                                                        <td className="fw-bold">#{order.id}</td>
                                                        <td>{this.formatDate(order.date)}</td>
                                                        <td>{order.items.length} {langCtx.getText('items')}</td>
                                                        <td>
                                                            <Badge className="badge-warning">
                                                                🛵 COD
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <Badge className={this.getStatusBadge(order.status)}>
                                                                {order.status === 'Pending' && '⏳ '}
                                                                {order.status === 'Verified' && '✅ '}
                                                                {order.status === 'Delivered' && '📦 '}
                                                                {order.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="text-end fw-bold" style={{ color: '#2E7D32' }}>
                                                            ₹{order.grandTotal.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {totalPages > 1 && this.renderPagination(langCtx, currentPage, totalPages)}
                                    </TableWrapper>
                                )}
                            </>
                        )}
                    </div>
                )}
            </LanguageContext.Consumer>
        );
    }

    renderPagination(langCtx, currentPage, totalPages) {
        return (
            <PaginationWrapper>
                <button
                    disabled={currentPage === 1}
                    onClick={() => this.setState({ currentPage: currentPage - 1 })}
                >
                    ‹ {langCtx.getText('back')}
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        className={currentPage === i + 1 ? 'active' : ''}
                        onClick={() => this.setState({ currentPage: i + 1 })}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => this.setState({ currentPage: currentPage + 1 })}
                >
                    {langCtx.getText('close')} ›
                </button>
            </PaginationWrapper>
        );
    }
}

export default BillHistoryPage;
