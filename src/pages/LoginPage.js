import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import LanguageContext from '../context/LanguageContext';
import { toast } from 'react-toastify';
import {
    AuthContainer,
    
} from '../styledComponents/LayoutStyles';

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
                            <div className="container-fluid">
                                <div className="row min-vh-100 align-items-center">
                                    <div className="col-12 col-lg-6 p-4 p-lg-5 d-flex justify-content-center justify-content-lg-start">
                                        <div className="text-white" style={{ maxWidth: '500px', lineHeight: 1.8 }}>
                                            <div className="mb-3 opacity-75">{langCtx.getText('welcomeBack')}</div>
                                            <h2 className="fw-bold mb-4">{langCtx.getText('shopName')}</h2>

                                            <div className="mb-3">
                                                <div className="fw-semibold">{langCtx.getText('ownerLabel')}</div>
                                                <div className="opacity-75">{langCtx.getText('ownerName')}</div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="fw-semibold">{langCtx.getText('addressLabel')}</div>
                                                <div className="opacity-75">{langCtx.getText('address').split('\n').join(', ')}</div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="fw-semibold">{langCtx.getText('phoneLabel')}</div>
                                                <div>
                                                    <a href="tel:+919441754505" className="text-warning text-decoration-none">
                                                        {langCtx.getText('phoneLink')}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 col-lg-5 offset-lg-1 p-4 p-lg-5 d-flex justify-content-center">
                                        <div className="w-100" style={{ maxWidth: '420px' }}>
                                            <div className="card shadow-lg border-0 rounded-4">
                                                <div className="card-body p-4 p-lg-5">
                                                    <div className="text-center mb-4">
                                                        <div className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-3 mb-2" style={{ width: '56px', height: '56px', fontSize: '1.75rem' }}>
                                                            🛒
                                                        </div>
                                                        <h2 className="h4 fw-bold mb-1">{langCtx.getText('signIn')}</h2>
                                                        <p className="text-muted mb-0">{langCtx.getText('signInTo')}</p>
                                                    </div>

                                                    {errors.general && (
                                                        <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem' }}>
                                                            {errors.general}
                                                        </div>
                                                    )}

                                                    <form onSubmit={this.handleSubmit}>
                                                        <div className="mb-3">
                                                            <label className="form-label fw-semibold">{langCtx.getText('emailAddress')}</label>
                                                            <input
                                                                type="email"
                                                                className="form-control rounded-3"
                                                                placeholder="you@example.com"
                                                                value={email}
                                                                onChange={this.handleChange('email')}
                                                            />
                                                            {errors.email && (
                                                                <div className="text-danger mt-1" style={{ fontSize: '0.85rem' }}>
                                                                    ⚠ {errors.email}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="mb-3">
                                                            <label className="form-label fw-semibold">{langCtx.getText('password')}</label>
                                                            <input
                                                                type="password"
                                                                className="form-control rounded-3"
                                                                placeholder={langCtx.getText('password')}
                                                                value={password}
                                                                onChange={this.handleChange('password')}
                                                            />
                                                            {errors.password && (
                                                                <div className="text-danger mt-1" style={{ fontSize: '0.85rem' }}>
                                                                    ⚠ {errors.password}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <button type="submit" className="btn btn-success w-100 py-2" disabled={loading}>
                                                            {loading ? (
                                                                <>
                                                                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                                                                    {langCtx.getText('signingIn')}
                                                                </>
                                                            ) : (
                                                                langCtx.getText('signIn')
                                                            )}
                                                        </button>
                                                    </form>

                                                    <div className="mt-3 text-center">
                                                        <span className="text-muted">{langCtx.getText('dontHaveAccount')} </span>
                                                        <Link to="/register">{langCtx.getText('createOne')}</Link>
                                                    </div>

                                                    <div className="mt-4 p-3 rounded-3 bg-dark bg-opacity-25" style={{ fontSize: '0.8rem' }}>
                                                        <strong className="text-warning">{langCtx.getText('demoAccounts')}:</strong><br />
                                                        {langCtx.getText('admin')}: {langCtx.getText('testAdmin')}<br />
                                                        {langCtx.getText('customer')}: {langCtx.getText('testCustomer')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AuthContainer>
                    );
                }}
            </LanguageContext.Consumer>
        );
    }
}

export default LoginPage;
