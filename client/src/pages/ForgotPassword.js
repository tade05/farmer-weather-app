import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>🌾 FarmWeather</h1>
          <p>Reset your password</p>
        </div>

        {submitted ? (
          <div className="reset-success">
            <div className="success-message">
              ✅ Reset link sent! Check your email inbox.
            </div>
            <p className="reset-info">
              We sent a password reset link to <strong>{email}</strong>.
              The link expires in 1 hour.
            </p>
            <p className="auth-switch">
              <Link to="/login">Back to Login</Link>
            </p>
          </div>
        ) : (
          <>
            <p className="reset-info">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <p className="auth-switch">
              Remember your password? <Link to="/login">Login here</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;