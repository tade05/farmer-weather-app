import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../utils/api';
import { AuthContext } from '../context/AuthContext';

// 1. Define validation schema with Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[!@#$%^&*]/, 'Must contain at least one special character')
    .required('Password is required'),
});

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // 2. useFormik hook replaces useState for form fields
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,                          // 3. Attach Yup schema here
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const res = await login(values);
        loginUser(res.data.token);
        navigate('/dashboard');
      } catch (err) {
        setStatus(err.response?.data?.message || 'Login failed');
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>🌾 FarmWeather</h1>
          <p>Welcome back, Farmer!</p>
        </div>

        {/* 4. formik.status holds server-side errors */}
        {formik.status && <div className="error-message">{formik.status}</div>}

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}        // 5. handleBlur triggers validation on touch
              placeholder="Enter your email"
            />
            {/* 6. Show error only after field is touched */}
            {formik.touched.email && formik.errors.email && (
              <span className="field-error">{formik.errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <span className="field-error">{formik.errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;