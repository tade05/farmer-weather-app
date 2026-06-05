import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[!@#$%^&*]/, 'Must contain at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Please confirm your password'),
});

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await api.post(`/auth/reset-password/${token}`, {
          password: values.password
        });
        navigate('/login', { state: { message: 'Password reset successful! Please login.' } });
      } catch (err) {
        setStatus(err.response?.data?.message || 'Reset failed. Link may have expired.');
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>🌾 FarmWeather</h1>
          <p>Set your new password</p>
        </div>

        {formik.status && <div className="error-message">{formik.status}</div>}

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter new password"
            />
            {formik.touched.password && formik.errors.password && (
              <span className="field-error">{formik.errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Confirm new password"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <span className="field-error">{formik.errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="auth-switch">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;