import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordField from '../../components/PasswordField';
import { changePassword } from '../../api/userApi';
import { clearSession } from '../../utils/auth';
import '../../styles/Register.css';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    if (form.newPassword !== form.confirmNewPassword) {
      setErrors({ confirmNewPassword: 'New passwords do not match.' });
      return;
    }

    setSaving(true);
    try {
    await changePassword(form);
    clearSession();
    navigate('/login', { state: { passwordChanged: true } });
    } catch (err) {
    const data = err.response?.data;
    setErrors(data?.errors || {});
    setMessage(data?.message || 'Could not change password. Please try again.');
    } finally {
    setSaving(false);
    }
}

return (
    <section className="card">
    <h1>Change password</h1>
    <p>After changing it, you will be logged out and need to log in again.</p>

    {message && <div className="alert alert-error">{message}</div>}

    <form onSubmit={handleSubmit} noValidate>
        <PasswordField
        label="Current password"
        name="currentPassword"
        value={form.currentPassword}
        onChange={handleChange}
        error={errors.currentPassword}
        />
        <PasswordField
        label="New password"
        name="newPassword"
        value={form.newPassword}
        onChange={handleChange}
        error={errors.newPassword}
        />
        <PasswordField
        label="Confirm new password"
        name="confirmNewPassword"
        value={form.confirmNewPassword}
        onChange={handleChange}
        error={errors.confirmNewPassword}
        />

        <button type="submit" className="btn btn-full" disabled={saving}>
        {saving ? 'Saving…' : 'Change password'}
        </button>
    </form>

    <p><Link to="/account">Back to My account</Link></p>
    </section>
);
}