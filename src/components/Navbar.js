import React from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { Link } from 'react-router-dom';
import {
    NavbarWrapper,
    NavBrand,
    NavActions,
    UserInfo,
    LogoutButton,
    HamburgerButton,
} from '../styledComponents/NavbarStyles';

class Navbar extends React.Component {
    static contextType = AuthContext;

    render() {
        const { user, isAuthenticated, role, logout } = this.context;
        const { onToggleSidebar } = this.props;

        return (
            <NavbarWrapper>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isAuthenticated && (
                        <HamburgerButton onClick={onToggleSidebar} aria-label="Toggle sidebar">
                            ☰
                        </HamburgerButton>
                    )}
                    <Link to={isAuthenticated ? '/products' : '/login'} style={{ textDecoration: 'none' }}>
                        <NavBrand>
                            <div className="logo-icon">🛒</div>
                            <div className="brand-text">
                                Grocery<span>Mart</span>
                            </div>
                        </NavBrand>
                    </Link>
                </div>

                {isAuthenticated && (
                    <NavActions>
                        <CartContext.Consumer>
                            {(cartCtx) => (
                                <Link to="/cart" style={{ textDecoration: 'none', position: 'relative' }}>
                                    <span style={{ fontSize: '1.5rem', color: 'white', cursor: 'pointer' }}>🛒</span>
                                    {cartCtx.getItemCount() > 0 && (
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: '-6px',
                                                right: '-10px',
                                                background: '#E53935',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.7rem',
                                                fontWeight: '700',
                                            }}
                                        >
                                            {cartCtx.getItemCount()}
                                        </span>
                                    )}
                                </Link>
                            )}
                        </CartContext.Consumer>

                        <UserInfo>
                            <div className="user-avatar">
                                {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="user-details">
                                <span className="user-name">{user ? user.name : 'User'}</span>
                                <span className="user-role">{role || 'customer'}</span>
                            </div>
                        </UserInfo>

                        <LogoutButton onClick={logout}>
                            ⏻ Logout
                        </LogoutButton>
                    </NavActions>
                )}
            </NavbarWrapper>
        );
    }
}

export default Navbar;
