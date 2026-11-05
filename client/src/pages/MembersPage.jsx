import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = {
  memberId: '',
  name: '',
  email: '',
  phone: '',
  membershipDate: '',
};

function MembersPage() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const loadMembers = async () => {
    const { data } = await api.get('/members');
    setMembers(data);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await api.put(`/members/${editingId}`, form);
      } else {
        await api.post('/members', form);
      }

      resetForm();
      loadMembers();
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong while saving the member.');
    }
  };

  const handleEdit = (member) => {
    setEditingId(member._id);
    setForm({
      memberId: member.memberId || '',
      name: member.name,
      email: member.email,
      phone: member.phone,
      membershipDate: member.membershipDate ? new Date(member.membershipDate).toISOString().slice(0, 10) : '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    try {
      await api.delete(`/members/${id}`);
      loadMembers();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to delete the member.');
    }
  };

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="page-header small-gap">
          <div>
            <p className="eyebrow">Members</p>
            <h2>{editingId ? 'Edit Member' : 'Add Member'}</h2>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <input name="memberId" value={form.memberId} onChange={handleChange} placeholder="Member ID" required />
          <input name="name" value={form.name} onChange={handleChange} placeholder="Member name" required />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" required />
          <input name="membershipDate" type="date" value={form.membershipDate} onChange={handleChange} />

          <div className="form-actions">
            <button type="submit" className="primary-btn">{editingId ? 'Update Member' : 'Add Member'}</button>
            {editingId && (
              <button type="button" className="secondary-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel list-panel">
        <div className="page-header small-gap">
          <div>
            <p className="eyebrow">Records</p>
            <h2>Members List</h2>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Membership Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id}>
                  <td>{member.memberId || 'N/A'}</td>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td>{member.membershipDate ? new Date(member.membershipDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="action-cell">
                    <button type="button" className="secondary-btn" onClick={() => handleEdit(member)}>
                      Edit
                    </button>
                    <button type="button" className="danger-btn" onClick={() => handleDelete(member._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default MembersPage;
