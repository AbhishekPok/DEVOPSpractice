import { useState, useEffect } from 'react';
import { Trash2, Search, Shield, User, AlertTriangle, UserPlus, CheckCircle, XCircle, ArrowLeft, Lock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import styles from './admin.module.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null); // ID of user to delete
    const [showAddModal, setShowAddModal] = useState(false);
    const [passwordModal, setPasswordModal] = useState({ show: false, user: null });
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await authService.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError('Failed to load users. You might not have permission.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await authService.deleteUser(userId);
            setUsers(users.filter(user => user.id !== userId));
            setDeleteConfirm(null);
        } catch (err) {
            alert('Failed to delete user.');
            console.error(err);
        }
    };

    const handleStatusToggle = async (user) => {
        try {
            const updatedUser = await authService.updateUser(user.id, { is_active: !user.is_active });
            setUsers(users.map(u => u.id === user.id ? updatedUser : u));
        } catch (err) {
            alert('Failed to update user status.');
            console.error(err);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await authService.createUser(newUser);
            setShowAddModal(false);
            setNewUser({ username: '', email: '', password: '', first_name: '', last_name: '' });
            fetchUsers(); // Refresh list
            alert('User created successfully!');
        } catch (err) {
            alert('Failed to create user: ' + (err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Unknown error'));
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            await authService.adminChangePassword(passwordModal.user.id, newAdminPassword);
            setPasswordModal({ show: false, user: null });
            setNewAdminPassword('');
            alert('Password updated successfully');
        } catch (error) {
            console.error('Error resetting password:', error);
            setError('Failed to reset password');
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.first_name + ' ' + user.last_name).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate Stats
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.is_active).length;
    const newUsers = users.filter(u => {
        const joinDate = new Date(u.date_joined);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return joinDate >= sevenDaysAgo;
    }).length;

    // Chart Data
    const chartData = users.reduce((acc, user) => {
        const date = new Date(user.date_joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const existing = acc.find(item => item.name === date);
        if (existing) {
            existing.users += 1;
        } else {
            acc.push({ name: date, users: 1 });
        }
        return acc;
    }, []).sort((a, b) => new Date(a.name) - new Date(b.name));

    // Convert to cumulative for "Growth"
    let cumulative = 0;
    const growthData = chartData.map(item => {
        cumulative += item.users;
        return { ...item, users: cumulative };
    });


    if (loading) return <div className={styles.loading}>Loading users...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <button className={styles.backBtn} onClick={() => navigate('/home')}>
                        <ArrowLeft size={24} />
                    </button>
                    <div className={styles.titleText}>
                        <h1>Admin Dashboard</h1>
                        <p>Manage users and monitor system status</p>
                    </div>
                </div>
                <div className={styles.actions}>
                    <div className={styles.searchBox}>
                        <Search className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <button className={styles.addUserBtn} onClick={() => setShowAddModal(true)}>
                        <UserPlus size={20} />
                        Add User
                    </button>
                </div>
            </div>

            {/* KPI Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconUsers} `}>
                        <User size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Users</span>
                        <span className={styles.statValue}>{totalUsers}</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconActive} `}>
                        <CheckCircle size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Active Users</span>
                        <span className={styles.statValue}>{activeUsers}</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconNew} `}>
                        <UserPlus size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>New (7 Days)</span>
                        <span className={styles.statValue}>{newUsers}</span>
                    </div>
                </div>
            </div>

            {/* Growth Chart */}
            <div className={styles.chartSection}>
                <h2>User Growth</h2>
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={growthData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ background: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                            />
                            <Line type="monotone" dataKey="users" stroke="#16a34a" strokeWidth={3} dot={{ r: 4, fill: '#16a34a' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2>User Management</h2>
                    <span className={styles.userCount}>{filteredUsers.length} users found</span>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className={styles.userInfo}>
                                            <div className={styles.avatar}>
                                                {user.first_name ? user.first_name[0] : user.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className={styles.name}>
                                                    {user.first_name} {user.last_name}
                                                </div>
                                                <div className={styles.username}>@{user.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.is_superuser ? (
                                            <span className={styles.badgeAdmin}>Admin</span>
                                        ) : (
                                            <span className={styles.badgeUser}>User</span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className={user.is_active ? styles.statusActive : styles.statusInactive}
                                            onClick={() => !user.is_superuser && handleStatusToggle(user)}
                                            disabled={user.is_superuser}
                                            title={user.is_superuser ? "Cannot deactivate admin" : "Toggle Status"}
                                        >
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                                    <td>
                                        {!user.is_superuser && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    className={styles.actionBtn}
                                                    onClick={() => setPasswordModal({ show: true, user })}
                                                    title="Change Password"
                                                >
                                                    <Lock size={18} />
                                                </button>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.deleteBtn} `}
                                                    onClick={() => setDeleteConfirm(user.id)}
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <AlertTriangle className={styles.warningIcon} />
                        <h2>Delete User?</h2>
                        <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setDeleteConfirm(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.confirmBtn}
                                onClick={() => handleDelete(deleteConfirm)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {showAddModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalForm}>
                        <h2>Add New User</h2>
                        <form onSubmit={handleCreateUser}>
                            <div className={styles.formGroup}>
                                <label>Username</label>
                                <input
                                    type="text"
                                    required
                                    value={newUser.username}
                                    onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div className={styles.nameRow}>
                                <div className={styles.formGroup}>
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        value={newUser.first_name}
                                        onChange={e => setNewUser({ ...newUser, first_name: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        value={newUser.last_name}
                                        onChange={e => setNewUser({ ...newUser, last_name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    className={styles.cancelBtn}
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submitBtn}
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {passwordModal.show && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalForm}>
                        <h2>Change Password</h2>
                        <p style={{ textAlign: 'center', marginBottom: '1rem', color: '#64748b' }}>
                            For user: <strong>{passwordModal.user?.username}</strong>
                        </p>
                        <form onSubmit={handlePasswordReset}>
                            <div className={styles.formGroup}>
                                <label>New Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={newAdminPassword}
                                    onChange={e => setNewAdminPassword(e.target.value)}
                                    placeholder="Enter new password (min 8 chars)"
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    className={styles.cancelBtn}
                                    onClick={() => {
                                        setPasswordModal({ show: false, user: null });
                                        setNewAdminPassword('');
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submitBtn}
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
