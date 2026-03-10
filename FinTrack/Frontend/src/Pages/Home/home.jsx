import { useState, useEffect } from 'react';
import { IconCurrencyRupeeNepalese } from '@tabler/icons-react';
import { Dashboard } from '../../components/homepagecomponents/Dashboard';
import { Transactions } from '../../components/homepagecomponents/Transactions';
import { ClusteringInsights } from '../../components/homepagecomponents/ClusteringInsights';
import { Reports } from '../../components/homepagecomponents/Reports';
import Categories from '../Categories/Categories';
import BudgetPlanning from '../BudgetPlanning/BudgetPlanning';
import Profile from '../Profile/Profile';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/homepagecomponents/Sidebar';
import authService from '../../services/authService';
import styles from './homepage.module.css';

export default function HomePage() {
    const [currentView, setCurrentView] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                // We could store user info in context to avoid refetching, 
                // but for now fetching here is safe.
                const user = await authService.getProfile();
                if (user.is_superuser) {
                    navigate('/admin');
                }
            } catch (error) {
                console.error("Failed to check admin status", error);
            }
        };
        checkAdmin();
    }, [navigate]);


    return (
        <div className={styles.appContainer}>
            <button
                className={styles.menuToggle}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
            >
                <IconCurrencyRupeeNepalese className={styles.menuToggleIcon} />
                <span className={styles.menuToggleText}>FinTrack</span>
            </button>

            <div
                className={`${styles.overlay} ${sidebarOpen ? styles.visible : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            <Sidebar
                currentView={currentView}
                onViewChange={(view) => {
                    setCurrentView(view);
                    setSidebarOpen(false);
                }}
                isOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <main className={styles.mainContent}>
                <div className={styles.contentWrapper}>
                    {currentView === 'dashboard' && <Dashboard />}
                    {currentView === 'transactions' && <Transactions />}
                    {currentView === 'categories' && <Categories />}
                    {currentView === 'budgets' && <BudgetPlanning />}
                    {currentView === 'insights' && <ClusteringInsights />}
                    {currentView === 'reports' && <Reports />}
                    {currentView === 'profile' && <Profile />}
                </div>
            </main>
        </div>
    );
}