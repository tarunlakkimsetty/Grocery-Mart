import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import billService from '../services/billService';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { PageHeader } from '../styledComponents/LayoutStyles';
import { TableWrapper, PaginationWrapper, EmptyState } from '../styledComponents/FormStyles';
import { Badge } from '../styledComponents/FormStyles';

const ITEMS_PER_PAGE = 10;

class BillHistoryPage extends React.Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            bills: [],
            loading: true,
            error: null,
            currentPage: 1,
            redirectTo: null,
        };
    }

    componentDidMount() {
        this.fetchBills();
    }

    fetchBills = async () => {
        this.setState({ loading: true });
        try {
            const { user } = this.context;
            const bills = await billService.getBillHistory(user ? user.id : 2);
            this.setState({ bills, loading: false });
        } catch (err) {
            this.setState({ error: 'Failed to load bill history', loading: false });
            toast.error('Failed to load bill history');
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

    render() {
        if (this.state.redirectTo) {
            return <Navigate to={this.state.redirectTo} />;
        }

        const { bills, loading, error, currentPage } = this.state;
        const totalPages = Math.ceil(bills.length / ITEMS_PER_PAGE);
        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        const visibleBills = bills.slice(startIdx, startIdx + ITEMS_PER_PAGE);

        return (
            <div>
                <PageHeader>
                    <h1>📋 Purchase History</h1>
                    <p>{bills.length} total transactions</p>
                </PageHeader>

                {loading && <Spinner fullPage text="Loading history..." />}
                {error && <div className="alert alert-danger">{error}</div>}

                {!loading && !error && bills.length === 0 && (
                    <EmptyState>
                        <div className="empty-icon">🧾</div>
                        <h3>No Purchase History</h3>
                        <p>Your past purchases will appear here.</p>
                    </EmptyState>
                )}

                {!loading && !error && bills.length > 0 && (
                    <TableWrapper $clickable>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Bill No</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Payment</th>
                                    <th className="text-end">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleBills.map((bill) => (
                                    <tr
                                        key={bill.id}
                                        onClick={() => this.setState({ redirectTo: `/bill/${bill.id}` })}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td className="fw-bold">#{bill.id}</td>
                                        <td>{this.formatDate(bill.date)}</td>
                                        <td>{bill.items.length} item(s)</td>
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

                        {totalPages > 1 && (
                            <PaginationWrapper>
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => this.setState({ currentPage: currentPage - 1 })}
                                >
                                    ‹ Prev
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
                                    Next ›
                                </button>
                            </PaginationWrapper>
                        )}
                    </TableWrapper>
                )}
            </div>
        );
    }
}

export default BillHistoryPage;
