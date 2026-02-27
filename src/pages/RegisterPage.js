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
import { validators } from '../utils/validators';

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

class RegisterPage extends React.Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            phone: '',
            email: '',
            password: '',
            place: '',
            errors: {},
            loading: false,
        };
        this.languageContext = null;
    }

    validate = () => {
        const errors = {};
        const { name, phone, email, password, place } = this.state;

        errors.name = validators.validateName(name, this.languageContext.getText);
        errors.phone = validators.validatePhone(phone, this.languageContext.getText);
        errors.email = validators.validateEmail(email, this.languageContext.getText);
        errors.password = validators.validatePassword(password, this.languageContext.getText);
        errors.place = validators.validatePlace(place, this.languageContext.getText);

        // Remove empty error properties
        Object.keys(errors).forEach(key => !errors[key] && delete errors[key]);

        this.setState({ errors });
        return Object.keys(errors).length === 0;
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        if (!this.validate()) return;

        this.setState({ loading: true });
        try {
            const { name, phone, email, password, place } = this.state;
            await this.context.register({ name, phone, email, password, place });
            toast.success(this.languageContext.getText('registrationSuccess') + ' 🎉');
        } catch (err) {
            toast.error(err.message || this.languageContext.getText('registrationFailed'));
            this.setState({ errors: { general: err.message || 'Registration failed' } });
        } finally {
            this.setState({ loading: false });
        }
    };

    handleChange = (field) => (e) => {
        let value = e.target.value;
        // Enforce phone input to digits only
        if (field === 'phone') {
            value = value.replace(/\D/g, '').slice(0, 10);
        }
        // Enforce name and place to alphabets and spaces only
        if (field === 'name' || field === 'place') {
            value = value.replace(/[^a-zA-Z\s]/g, '');
        }
        this.setState({ [field]: value });
    };

    render() {
        if (this.context.isAuthenticated) {
            return <Navigate to="/products" replace />;
        }

        const { name, phone, email, password, place, errors, loading } = this.state;

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
                                        <h2>{langCtx.getText('signUp')}</h2>
                                        <p style={{marginBottom: 0}}>{langCtx.getText('shopName')}</p>
                                    </div>

                                    {errors.general && (
                                        <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem', borderRadius: '8px' }}>
                                            {errors.general}
                                        </div>
                                    )}

                                    <form onSubmit={this.handleSubmit}>
                                        <StyledInput>
                                            <label>{langCtx.getText('fullName')}</label>
                                            <input
                                                type="text"
                                                placeholder={langCtx.getText('fullName')}
                                                value={name}
                                                onChange={this.handleChange('name')}
                                            />
                                            {errors.name && <div className="error-text">⚠ {errors.name}</div>}
                                        </StyledInput>

                                        <StyledInput>
                                            <label>{langCtx.getText('phone')}</label>
                                            <input
                                                type="tel"
                                                placeholder="10 digit phone number"
                                                value={phone}
                                                onChange={this.handleChange('phone')}
                                                maxLength={10}
                                            />
                                            {errors.phone && <div className="error-text">⚠ {errors.phone}</div>}
                                        </StyledInput>

                                        <StyledInput>
                                            <label>{langCtx.getText('place')}</label>
                                            <input
                                                type="text"
                                                placeholder={langCtx.getText('place')}
                                                value={place}
                                                onChange={this.handleChange('place')}
                                            />
                                            {errors.place && <div className="error-text">⚠ {errors.place}</div>}
                                        </StyledInput>

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
                                                placeholder="Min 6 characters"
                                                value={password}
                                                onChange={this.handleChange('password')}
                                            />
                                            {errors.password && <div className="error-text">⚠ {errors.password}</div>}
                                        </StyledInput>

                                        <SubmitButton type="submit" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                                                    {langCtx.getText('creatingAccount')}
                                                </>
                                            ) : (
                                                langCtx.getText('signUp')
                                            )}
                                        </SubmitButton>
                                    </form>

                                    <div className="auth-footer">
                                        <span>{langCtx.getText('alreadyHaveAccount')} </span>
                                        <Link to="/login">{langCtx.getText('loginHere')}</Link>
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

export default RegisterPage;
