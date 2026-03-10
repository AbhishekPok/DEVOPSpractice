import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { IconCurrencyRupeeNepalese } from '@tabler/icons-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import transactionService from '../../services/transaction';
import styles from '../../styles/dashboard.module.css';

export function Dashboard() {
  const [stats, setStats] = useState({
    total_income: 0,
    total_expenses: 0,
    balance: 0,
    category_breakdown: { expense: {} }
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, recentData, trendsData] = await Promise.all([
          transactionService.getStats(),
          transactionService.getRecent(),
          transactionService.getTrends()
        ]);
        setStats(statsData);
        setRecentTransactions(recentData);
        setTrends(trendsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const topSpendingCategory = Object.entries(stats.category_breakdown?.expense || {})
    .reduce((max, [category, data]) =>
      data.total > max.total ? { category, total: data.total } : max
      , { category: 'None', total: 0 });

  if (loading) return <div className={styles.dashboard}>Loading...</div>;

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Dashboard</h1>
        <p className={styles.headerSubtitle}>Welcome back! Here's your financial overview</p>
      </div>

      {/* Financial Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Current Balance</h3>
            <IconCurrencyRupeeNepalese className={styles.cardIcon} style={{ color: '#089a36' }} />
          </div>
          <div className={styles.cardContent}>
            <p className={`${styles.cardAmount} ${styles.cardAmountBalance}`}>
              रु {stats.balance}
            </p>
            <p className={styles.cardSubtext}>Updated today</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Total Income</h3>
            <ArrowUpRight className={styles.cardIcon} style={{ color: '#16a34a' }} />
          </div>
          <div className={styles.cardContent}>
            <p className={`${styles.cardAmount} ${styles.cardAmountIncome}`}>
              रु {stats.total_income}
            </p>
            <p className={styles.cardSubtext}>Total</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Total Expenses</h3>
            <ArrowDownRight className={styles.cardIcon} style={{ color: '#dc2626' }} />
          </div>
          <div className={styles.cardContent}>
            <p className={`${styles.cardAmount} ${styles.cardAmountExpense}`}>
              रु {stats.total_expenses}
            </p>
            <p className={styles.cardSubtext}>Total</p>
          </div>
        </div>
      </div>

      {/* Spending Trends Chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <TrendingUp className={styles.chartIcon} style={{ color: '#089a36' }} />
          <h2 className={styles.chartTitle}>Spending Trends</h2>
        </div>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#16a34a"
                strokeWidth={2}
                dot={false}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#dc2626"
                strokeWidth={2}
                dot={false}
                name="Expense"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.twoColumnGrid}>
        {/* Recent Transactions */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.chartTitle}>Recent Transactions</h2>
          </div>
          <div className={styles.transactionsList}>
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className={styles.transactionItem}>
                <div className={styles.transactionInfo}>
                  <div className={styles.transactionHeader}>
                    <p className={styles.transactionMerchant}>{transaction.merchant}</p>
                    <span className={styles.transactionBadge}>
                      {transaction.category}
                    </span>
                  </div>
                  <p className={styles.transactionDate}>{transaction.date}</p>
                </div>
                <div className={`${styles.transactionAmount} ${transaction.type === 'income'
                  ? styles.transactionAmountIncome
                  : styles.transactionAmountExpense
                  }`}>
                  {transaction.type === 'income' ? '+' : '-'}रु{transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className={styles.insightsCard}>
          <div className={styles.insightsHeader}>
            <h2 className={styles.insightsTitle}>AI Insights</h2>
          </div>
          <div className={styles.insightsList}>
            <div className={styles.insightItem}>
              <p className={styles.insightLabel}>Top Spending Category</p>
              <div className={styles.insightContent}>
                <span className={styles.insightCategory}>{topSpendingCategory.category}</span>
                <span
                  className={styles.insightAmount}
                  style={{ color: '#dc2626' }}
                >
                  रु{topSpendingCategory.total}
                </span>
              </div>
            </div>

            <div className={styles.insightItem}>
              <p className={styles.insightLabel}>Monthly Trend</p>
              <p className={styles.insightText}>
                Keep tracking your expenses to see trends.
              </p>
            </div>

            <div className={styles.insightItem}>
              <p className={styles.insightLabel}>Savings Goal</p>
              <p className={styles.insightText}>
                You're on track to save ${(stats.balance * 0.2).toFixed(2)} this month. Keep it up!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}