import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import authService from '../../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.login(email, password);
      navigate("/home");
    } catch (error) {
      alert("Login failed! Please check your credentials.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.orbOne} />
      <div className={styles.orbTwo} />

      <div className={styles.card}>
        <div className={styles.left}>
          <div className={styles.brand}>
            <h1 className={styles.brandTitle}>FinTrack</h1>
            <p className={styles.brandText}>Your Personal Finance Manager</p>
          </div>
          <div className={styles.symbol}>
            <div className={styles.symbolBox}>रु</div>
            <p className={styles.symbolText}>Manage your finances in Nepali Rupees</p>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.header}>
            <h2 className={styles.title}>Welcome Back</h2>
            <p className={styles.subtitle}>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.group}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.group}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <button type="button" className={styles.forgot}>
              Forgot password?
            </button>

            <button type="submit" className={styles.submit}>
              Sign In
            </button>
          </form>

          <div className={styles.divider} />

          <div className={styles.actions}>
            <p className={styles.text}>Don't have an account?</p>
            <button className={styles.create} onClick={() => navigate("/register")}>
              Create Account
            </button>
            <button className={styles.home} onClick={() => navigate("/")}>
              Return Home
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}