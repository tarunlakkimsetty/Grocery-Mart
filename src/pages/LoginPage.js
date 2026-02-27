import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import LanguageContext from '../context/LanguageContext';
import { toast } from 'react-toastify';
import {
    AuthContainer,
    AuthCard,
    StyledInput,
} from '../styledComponents/LayoutStyles';
import { SubmitButton } from '../styledComponents/ButtonStyles';
import styled from 'styled-components';

const AuthWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    width: 100%;

    @media (max-width: 992px) {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
`;

const ShopInfoCard = styled.div`
    background: linear-gradient(135deg, #2E7D32 0%, #1b5e20 100%);
    color: white;
    padding: 2rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h2 {
        font-size: 1.8rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        font-family: 'Outfit', sans-serif;
    }

    .info-section {
        margin-bottom: 1.5rem;

        .info-label {
            color: #ffd700;
            font-weight: 600;
            font-size: 0.9rem;
            margin-bottom: 0.3rem;
            display: block;
        }

        .info-value {
            color: #fff;
            font-size: 1rem;
            line-height: 1.5;
        }
    }

    .welcome-text {
        font-size: 0.95rem;
        opacity: 0.95;
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }

    @media (max-width: 992px) {
        margin-bottom: 1rem;
    }
`;

class LoginPage extends React.Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errors: {},
            loading: false,
        };
    }

    validate = () => {
        const errors = {};
        const { email, password } = this.state;

        if (!email.trim()) {
            errors.email = this.languageContext.getText('emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = this.languageContext.getText('emailInvalid');
        }

        if (!password) {
            errors.password = this.languageContext.getText('passwordRequired');
        } else if (password.length < 6) {
            errors.password = this.languageContext.getText('passwordMinLength');
        }

        this.setState({ errors });
        return Object.keys(errors).length === 0;
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        if (!this.validate()) return;

        this.setState({ loading: true });
        try {
            await this.context.login(this.state.email, this.state.password);
            toast.success(this.languageContext.getText('loginSuccess') + ' 🎉');
        } catch (err) {
            toast.error(err.message || this.languageContext.getText('loginFailed'));
            this.setState({ errors: { general: err.message || 'Invalid credentials' } });
        } finally {
            this.setState({ loading: false });
        }
    };

    handleChange = (field) => (e) => {
        this.setState({ [field]: e.target.value });
    };

    render() {
        if (this.context.isAuthenticated) {
            return <Navigate to="/products" replace />;
        }

        const { email, password, errors, loading } = this.state;

        return (
            <LanguageContext.Consumer>
                {(langCtx) => {
                    this.languageContext = langCtx;
                    return (
                        <AuthContainer>
                            <AuthWrapper>
                                <ShopInfoCard>
                                    <div className="welcome-text">
                                        {langCtx.getText('welcomeBack')}
                                    </div>
                                    <h2>{langCtx.getText('shopName')}</h2>

                                    <div className="info-section">
                                        <span className="info-label">{langCtx.getText('ownerLabel')}</span>
                                        <span className="info-value">{langCtx.getText('ownerName')}</span>
                                    </div>

                                    <div className="info-section">
                                        <span className="info-label">{langCtx.getText('addressLabel')}</span>
                                        <span className="info-value">
                                            {langCtx.getText('address').split('\n').map((line, idx) => (
                                                <React.Fragment key={idx}>
                                                    {line}
                                                    {idx < langCtx.getText('address').split('\n').length - 1 && <br />}
                                                </React.Fragment>
                                            ))}
                                        </span>
                                    </div>

                                    <div className="info-section">
                                        <span className="info-label">{langCtx.getText('phoneLabel')}</span>
                                        <span className="info-value">
                                            <a href="tel:+919441754505" style={{ color: '#ffd700', textDecoration: 'none' }}>
                                                {langCtx.getText('phoneLink')}
                                            </a>
                                        </span>
                                    </div>
                                </ShopInfoCard>

                                <AuthCard>
                                    <div className="auth-header">
                                        <div className="auth-logo">🛒</div>
                                        <h2>{langCtx.getText('signIn')}</h2>
                                        <p style={{marginBottom: 0}}>{langCtx.getText('signInTo')}</p>
                                    </div>

                                    {errors.general && (
                                        <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem', borderRadius: '8px' }}>
                                            {errors.general}
                                        </div>
                                    )}

                                    <form onSubmit={this.handleSubmit}>
                                        <StyledInput>
                                            <label>{langCtx.getText('emailAddress')}</label>
                                            <input
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={this.handleChange('email')}
                                            />
                                            {errors.email && <div className="error-text">⚠ {errors.email}</div>}
                                        </StyledInput>

                                        <StyledInput>
                                            <label>{langCtx.getText('password')}</label>
                                            <input
                                                type="password"
                                                placeholder={langCtx.getText('password')}
                                                value={password}
                                                onChange={this.handleChange('password')}
                                            />
                                            {errors.password && <div className="error-text">⚠ {errors.password}</div>}
                                        </StyledInput>

                                        <SubmitButton type="submit" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                                                    {langCtx.getText('signingIn')}
                                                </>
                                            ) : (
                                                langCtx.getText('signIn')
                                            )}
                                        </SubmitButton>
                                    </form>

                                    <div className="auth-footer">
                                        <span>{langCtx.getText('dontHaveAccount')} </span>
                                        <Link to="/register">{langCtx.getText('createOne')}</Link>
                                    </div>

                                    <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '0.75rem', color: '#adb5bd' }}>
                                        <strong style={{ color: '#FFB300' }}>{langCtx.getText('demoAccounts')}:</strong><br />
                                        {langCtx.getText('admin')}: {langCtx.getText('testAdmin')}<br />
                                        {langCtx.getText('customer')}: {langCtx.getText('testCustomer')}
                                    </div>
                                </AuthCard>
                            </AuthWrapper>
                        </AuthContainer>
                    );
                }}
            </LanguageContext.Consumer>
        );
    }
}

export default LoginPage;
