import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../../components/FormField';
import { getMe } from '../../api/authApi';
import { updateMe } from '../../api/userApi';
import { getMyShelter, updateMyShelter } from '../../api/shelterApi';
import { getRole } from '../../utils/auth';
import '../../styles/Register.css';

export default function EditProfile() {
const navigate = useNavigate();
const isShelter = getRole() === 'SHELTER';

const [form, setForm] = useState({ firstName: '', lastName: '', phoneNumber: '' });
const [org, setOrg] = useState({ organizationName: '', contactNumber: '', address: '', description: '' });
const [email, setEmail] = useState('');
const [errors, setErrors] = useState({});
const [message, setMessage] = useState('');
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

  // Load my current details from the database
useEffect(() => {
    async function load() {
    try {
        const me = await getMe();
        setEmail(me.email);
        setForm({
        firstName: me.firstName || '',
        lastName: me.lastName || '',
        phoneNumber: me.phoneNumber || '',
        });
        if (isShelter) {
        const s = await getMyShelter();
        setOrg({
            organizationName: s.organizationName || '',
            contactNumber: s.contactNumber || '',
            address: s.address || '',
            description: s.description || '',
        });
        }
    } catch {
        setMessage('Could not load your profile.');
    } finally {
        setLoading(false);
    }
    }
    load();
}, [isShelter]);

function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
}

function handleOrgChange(e) {
    setOrg({ ...org, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
}

async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setSaving(true);
    try {
    await updateMe(form);
    if (isShelter) {
        await updateMyShelter(org);
    }
    navigate('/account', { state: { saved: true } });
    } catch (err) {
    const data = err.response?.data;
    setErrors(data?.errors || {});
    setMessage(data?.message || 'Could not save your profile. Please try again.');
    } finally {
    setSaving(false);
    }
}

if (loading) {
    return <section className="card"><p>Loading…</p></section>;
}

return (
    <section className="card">
    <h1>Edit profile</h1>
    <p>Email: <strong>{email}</strong> (cannot be changed)</p>

    {message && <div className="alert alert-error">{message}</div>}

    <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
        <FormField label="First name" name="firstName" value={form.firstName}
            onChange={handleChange} error={errors.firstName} />
        <FormField label="Last name" name="lastName" value={form.lastName}
            onChange={handleChange} error={errors.lastName} />
        </div>
        <FormField label="Phone number" name="phoneNumber" value={form.phoneNumber}
        onChange={handleChange} error={errors.phoneNumber} />

        {isShelter && (
        <>
            <h2>Organization</h2>
            <FormField label="Organization name" name="organizationName" value={org.organizationName}
            onChange={handleOrgChange} error={errors.organizationName} />
            <FormField label="Contact number" name="contactNumber" value={org.contactNumber}
            onChange={handleOrgChange} error={errors.contactNumber} />
            <FormField label="Address" name="address" value={org.address}
            onChange={handleOrgChange} error={errors.address} />
            <div className="form-field">
            <label htmlFor="description">Description (optional)</label>
            <textarea id="description" name="description" rows="4"
                value={org.description} onChange={handleOrgChange} />
            {errors.description && <small className="field-error">{errors.description}</small>}
            </div>
        </>
        )}

        <button type="submit" className="btn btn-full" disabled={saving}>
        {saving ? 'Saving…' : 'Save changes'}
        </button>
    </form>

    <p><Link to="/account">Cancel</Link></p>
    </section>
);
}