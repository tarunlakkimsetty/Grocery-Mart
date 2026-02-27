import React from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import LanguageContext from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import LanguageToggle from './LanguageToggle';
import {
    NavbarWrapper,
    NavBrand,
    NavActions,
    UserInfo,
    LogoutButton,
    HamburgerButton,
} from '../styledComponents/NavbarStyles';

const StoreDetailsContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.5rem;
    align-items: start;
    padding: 0.75rem 0;
    width: 100%;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 0.75rem;
        padding: 0.5rem 0;
    }
`;

const DetailItem = styled.div`
    color: #fff;
    font-size: 0.85rem;
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;

    .detail-label {
        font-weight: 600;
        color: #ffd700;
        margin-bottom: 0.3rem;
        display: block;
    }

    .detail-value {
        font-size: 0.8rem;
        color: #fff;
        line-height: 1.4;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    @media (max-width: 768px) {
        font-size: 0.80rem;

        .detail-label {
            font-size: 0.75rem;
        }

        .detail-value {
            font-size: 0.75rem;
        }
    }
`;

class Navbar extends React.Component {
    static contextType = AuthContext;

    render() {
        const { user, isAuthenticated, role, logout } = this.context;
        const { onToggleSidebar } = this.props;

        return (
            <LanguageContext.Consumer>
                {(langCtx) => (
                    <React.Fragment>
                        <NavbarWrapper>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                {isAuthenticated && (
                                    <HamburgerButton onClick={onToggleSidebar} aria-label="Toggle sidebar">
                                        ☰
                                    </HamburgerButton>
                                )}
                                <Link to={isAuthenticated ? '/products' : '/login'} style={{ textDecoration: 'none' }}>
                                    <NavBrand>
                                        <div className="logo-icon">🛒</div>
                                        <div className="brand-text" title={langCtx.getText('shopName')}>
                                            {langCtx.getText('shopName')}
                                        </div>
                                    </NavBrand>
                                </Link>
                            </div>

                            {isAuthenticated && (
                                <NavActions>
                                    <LanguageToggle />

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
                                            {user && user.phone && (
                                                <span className="user-phone" style={{ fontSize: '0.75rem', color: '#ccc' }}>
                                                    {user.phone}
                                                </span>
                                            )}
                                            <span className="user-role">{role || 'customer'}</span>
                                        </div>
                                    </UserInfo>

                                    <LogoutButton onClick={logout}>
                                        ⏻ {langCtx.getText('logout')}
                                    </LogoutButton>
                                </NavActions>
                            )}
                        </NavbarWrapper>

                        {isAuthenticated && (
                            <div style={{ background: '#1a472a', padding: '1rem', borderBottom: '1px solid #0d2818', overflow: 'hidden' }}>
                                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
                                    <StoreDetailsContainer>
                                        <DetailItem>
                                            <span className="detail-label">{langCtx.getText('ownerLabel')}:</span>
                                            <span className="detail-value">{langCtx.getText('ownerName')}</span>
                                        </DetailItem>
                                        <DetailItem>
                                            <span className="detail-label">{langCtx.getText('addressLabel')}:</span>
                                            <span className="detail-value">
                                                {langCtx.getText('address').split('\n').map((line, idx) => (
                                                    <React.Fragment key={idx}>
                                                        {line}
                                                        {idx < langCtx.getText('address').split('\n').length - 1 && <br />}
                                                    </React.Fragment>
                                                ))}
                                            </span>
                                        </DetailItem>
                                        <DetailItem>
                                            <span className="detail-label">{langCtx.getText('phoneLabel')}:</span>
                                            <span className="detail-value">
                                                <a href="tel:+919441754505" style={{ color: '#ffd700', textDecoration: 'none' }}>
                                                    {langCtx.getText('phoneLink')}
                                                </a>
                                            </span>
                                        </DetailItem>
                                    </StoreDetailsContainer>
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                )}
            </LanguageContext.Consumer>
        );
    }
}

export default Navbar;
