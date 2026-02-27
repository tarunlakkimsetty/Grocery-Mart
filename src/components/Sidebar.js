import React from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
    SidebarWrapper,
    SidebarOverlay,
    SidebarSection,
    SidebarLabel,
    SidebarItem,
} from '../styledComponents/SidebarStyles';
import {
    CategoryGrains,
    CategoryMilk,
    CategorySnacks,
    CategorySpices,
    CategoryOils,
    CategoryCondiments,
    CategoryCleaning,
    CategoryPersonalCare,
} from './categories/CategoryItems';

class Sidebar extends React.Component {
    static contextType = AuthContext;

    render() {
        const { isOpen, activeCategory, onSelectCategory, onClose } = this.props;
        const { role } = this.context;

        return (
            <>
                <SidebarOverlay $isOpen={isOpen} onClick={onClose} />
                <SidebarWrapper $isOpen={isOpen}>
                    <SidebarSection>
                        <SidebarLabel>Product Categories</SidebarLabel>
                        <CategoryGrains
                            active={activeCategory === 'grains'}
                            onClick={onSelectCategory}
                        />
                        <CategoryMilk
                            active={activeCategory === 'milk'}
                            onClick={onSelectCategory}
                        />
                        <CategorySnacks
                            active={activeCategory === 'snacks'}
                            onClick={onSelectCategory}
                        />
                        <CategorySpices
                            active={activeCategory === 'spices'}
                            onClick={onSelectCategory}
                        />
                        <CategoryOils
                            active={activeCategory === 'oils'}
                            onClick={onSelectCategory}
                        />
                        <CategoryCondiments
                            active={activeCategory === 'condiments'}
                            onClick={onSelectCategory}
                        />
                        <CategoryCleaning
                            active={activeCategory === 'cleaning'}
                            onClick={onSelectCategory}
                        />
                        <CategoryPersonalCare
                            active={activeCategory === 'personal'}
                            onClick={onSelectCategory}
                        />
                    </SidebarSection>

                    <SidebarSection>
                        <SidebarLabel>Navigation</SidebarLabel>
                        <Link to="/products" style={{ textDecoration: 'none' }}>
                            <SidebarItem>
                                <span className="item-icon">🏠</span>
                                <span className="item-label">All Products</span>
                            </SidebarItem>
                        </Link>
                        {role === 'customer' && (
                            <>
                                <Link to="/cart" style={{ textDecoration: 'none' }}>
                                    <SidebarItem>
                                        <span className="item-icon">🛒</span>
                                        <span className="item-label">My Cart</span>
                                    </SidebarItem>
                                </Link>
                                <Link to="/history" style={{ textDecoration: 'none' }}>
                                    <SidebarItem>
                                        <span className="item-icon">📋</span>
                                        <span className="item-label">Purchase History</span>
                                    </SidebarItem>
                                </Link>
                            </>
                        )}
                        {role === 'admin' && (
                            <>
                                <Link to="/admin/add" style={{ textDecoration: 'none' }}>
                                    <SidebarItem>
                                        <span className="item-icon">➕</span>
                                        <span className="item-label">Add Product</span>
                                    </SidebarItem>
                                </Link>
                                <Link to="/admin/bills" style={{ textDecoration: 'none' }}>
                                    <SidebarItem>
                                        <span className="item-icon">🧾</span>
                                        <span className="item-label">All Bills</span>
                                    </SidebarItem>
                                </Link>
                                <Link to="/admin/analytics" style={{ textDecoration: 'none' }}>
                                    <SidebarItem>
                                        <span className="item-icon">📊</span>
                                        <span className="item-label">Analytics</span>
                                    </SidebarItem>
                                </Link>
                            </>
                        )}
                    </SidebarSection>
                </SidebarWrapper>
            </>
        );
    }
}

export default Sidebar;
