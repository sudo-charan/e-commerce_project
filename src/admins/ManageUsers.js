import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from './adminComponents/AdminSidebar';
import './styles/ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users/all');
      setUsers(res.data);
      console.log("Users fetched:", res.data); // Debug log
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/delete/${id}`);
        fetchUsers();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <AdminSidebar />

      <div className="manage-users">
        <h2>Manage Users</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6">No users found.</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user?.user_id ?? 'N/A'}</td>
                  <td>{user?.name ?? 'N/A'}</td>
                  <td>{user?.email ?? 'N/A'}</td>
                  <td>{user?.phone ?? 'N/A'}</td>
                  <td>{user?.address ?? 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(user.user_id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
