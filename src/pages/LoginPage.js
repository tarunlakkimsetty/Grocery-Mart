import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
    AuthContainer,
    AuthCard,
    StyledInput,
} from '../styledComponents/LayoutStyles';
import { SubmitButton } from '../styledComponents/ButtonStyles';

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
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Enter a valid email address';
        }

        if (!password) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
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
            toast.success('Login successful! Welcome back 🎉');
        } catch (err) {
            toast.error(err.message || 'Login failed. Please try again.');
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
            <AuthContainer>
                <AuthCard>
                    <div className="auth-header">
                        <div className="auth-logo">🛒</div>
                        <h2>Welcome Back</h2>
                        <p>Sign in to your GroceryMart account</p>
                    </div>

                    {errors.general && (
                        <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem', borderRadius: '8px' }}>
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={this.handleSubmit}>
                        <StyledInput>
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={this.handleChange('email')}
                            />
                            {errors.email && <div className="error-text">⚠ {errors.email}</div>}
                        </StyledInput>

                        <StyledInput>
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={this.handleChange('password')}
                            />
                            {errors.password && <div className="error-text">⚠ {errors.password}</div>}
                        </StyledInput>

                        <SubmitButton type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </SubmitButton>
                    </form>

                    <div className="auth-footer">
                        <span>Don't have an account? </span>
                        <Link to="/register">Create one</Link>
                    </div>

                    <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '0.75rem', color: '#adb5bd' }}>
                        <strong style={{ color: '#FFB300' }}>Demo Accounts:</strong><br />
                        Admin: admin@grocery.com / admin123<br />
                        Customer: john@grocery.com / john1234
                    </div>
                </AuthCard>
            </AuthContainer>
        );
    }
}

export default LoginPage;
