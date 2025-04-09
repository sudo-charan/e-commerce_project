import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from './adminComponents/AdminSidebar';
import './styles/ManageUsers.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users/all');
      setUsers(res.data);
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
        toast.success('User deleted successfully!');
        fetchUsers();
      } catch (err) {
        console.error('Delete failed:', err);
        toast.error('Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <AdminSidebar />
      <div className="manage-users">
        <h2>Manage Users</h2>

        <input
          type="text"
          placeholder="Search by name or email..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-users">No users found.</td>
              </tr>
            ) : (
              displayedUsers.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id ?? 'N/A'}</td>
                  <td>{user.full_name ?? 'N/A'}</td>
                  <td>{user.email ?? 'N/A'}</td>
                  <td>{user.mobile ?? 'N/A'}</td>
                  <td>{user.gender ?? 'N/A'}</td>
                  <td>{user.address ?? 'N/A'}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
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

        {/* Pagination Controls */}
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default ManageUsers;
