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

class RegisterPage extends React.Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            phone: '',
            email: '',
            password: '',
            errors: {},
            loading: false,
        };
    }

    validate = () => {
        const errors = {};
        const { name, phone, email, password } = this.state;

        // Name: only alphabets and spaces
        if (!name.trim()) {
            errors.name = 'Name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(name)) {
            errors.name = 'Name must contain only alphabets';
        }

        // Phone: 10 digits only
        if (!phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(phone)) {
            errors.phone = 'Phone must be exactly 10 digits';
        }

        // Email
        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Enter a valid email address';
        }

        // Password: min 6 characters
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
            const { name, phone, email, password } = this.state;
            await this.context.register({ name, phone, email, password });
            toast.success('Registration successful! Welcome 🎉');
        } catch (err) {
            toast.error(err.message || 'Registration failed');
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
        // Enforce name to alphabets and spaces only
        if (field === 'name') {
            value = value.replace(/[^a-zA-Z\s]/g, '');
        }
        this.setState({ [field]: value });
    };

    render() {
        if (this.context.isAuthenticated) {
            return <Navigate to="/products" replace />;
        }

        const { name, phone, email, password, errors, loading } = this.state;

        return (
            <AuthContainer>
                <AuthCard>
                    <div className="auth-header">
                        <div className="auth-logo">🛒</div>
                        <h2>Create Account</h2>
                        <p>Join GroceryMart for convenient shopping</p>
                    </div>

                    {errors.general && (
                        <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem', borderRadius: '8px' }}>
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={this.handleSubmit}>
                        <StyledInput>
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={this.handleChange('name')}
                            />
                            {errors.name && <div className="error-text">⚠ {errors.name}</div>}
                        </StyledInput>

                        <StyledInput>
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                placeholder="10-digit phone number"
                                value={phone}
                                onChange={this.handleChange('phone')}
                                maxLength={10}
                            />
                            {errors.phone && <div className="error-text">⚠ {errors.phone}</div>}
                        </StyledInput>

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
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </SubmitButton>
                    </form>

                    <div className="auth-footer">
                        <span>Already have an account? </span>
                        <Link to="/login">Sign in</Link>
                    </div>
                </AuthCard>
            </AuthContainer>
        );
    }
}

export default RegisterPage;
