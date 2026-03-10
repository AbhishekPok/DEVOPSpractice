import { LayoutDashboard, Receipt, TrendingUp, FileText, LogOut, User, Shield, FolderKanban, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';
import authService from '../../services/authService';
import { IconCurrencyRupeeNepalese } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import styles from '../../Pages/Home/homepage.module.css';

export function Sidebar({ currentView, onViewChange, isOpen, toggleSidebar }) {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const profile = await authService.getProfile();
                if (profile.is_superuser || profile.is_staff) {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        checkAdminStatus();
    }, []);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'transactions', label: 'Transactions', icon: Receipt },
        { id: 'categories', label: 'Categories', icon: FolderKanban },
        { id: 'budgets', label: 'Budget Planning', icon: Wallet },
        { id: 'insights', label: 'AI Insights', icon: TrendingUp },
        { id: 'reports', label: 'Reports', icon: FileText },
    ];

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            {/* Brand Section - Acts as Close Button */}
            <div className={styles.sidebarBrand} onClick={toggleSidebar}>
                <div className={styles.sidebarLogo}>
                    <IconCurrencyRupeeNepalese size={24} />
                </div>
                <h1 className={styles.sidebarBrandText}>FinTrack</h1>
            </div>

            {/* Navigation */}
            <nav className={styles.sidebarNav}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`${styles.sidebarNavItem} ${currentView === item.id ? styles.active : ''
                                }`}
                        >
                            <Icon className={styles.sidebarIcon} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer Section */}
            <div className={styles.sidebarFooter}>
                {isAdmin && (
                    <button
                        onClick={() => navigate('/admin')}
                        className={`${styles.sidebarNavItem} ${currentView === 'admin' ? styles.active : ''} mb-2`}
                    >
                        <Shield className={styles.sidebarIcon} />
                        <span>Admin Panel</span>
                    </button>
                )}

                <button
                    onClick={() => onViewChange('profile')}
                    className={`${styles.sidebarNavItem} ${currentView === 'profile' ? styles.active : ''} mb-2`}
                >
                    <User className={styles.sidebarIcon} />
                    <span>Profile</span>
                </button>
                <button onClick={
                    () => {
                        localStorage.clear()
                        navigate("/")
                    }
                }
                    className={styles.logoutButton}
                >
                    <LogOut className={styles.sidebarIcon} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}