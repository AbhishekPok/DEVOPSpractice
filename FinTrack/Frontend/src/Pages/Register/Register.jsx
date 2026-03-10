import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './register.module.css';
import authService from '../../services/authService';

export default function Register({ onRegister }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState(''); // Added username state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await authService.register({ email, password, first_name: firstName, last_name: lastName, username }); // Added username to register call
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert("Registration failed! " + (error.response?.data?.detail || "Please try again."));
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
            <p className={styles.symbolText}>Start managing your finances today</p>
          </div>
        </div>

        <div className={styles.right}>
          <button className={styles.back} onClick={() => navigate("/login")}>
            ← Back to Login
          </button>

          <div className={styles.header}>
            <h2 className={styles.title}>Create Account</h2>
            <p className={styles.subtitle}>Sign up to start tracking your finances</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.nameRow}>
              <div className={styles.group}>
                <label htmlFor="firstName" className={styles.label}>First Name</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.group}>
                <label htmlFor="lastName" className={styles.label}>Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
            </div>

            {/* New username input field */}
            <div className={styles.group}>
              <label htmlFor="username" className={styles.label}>Username</label>
              <input
                id="username"
                type="text"
                placeholder="Create a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={styles.input}
              />
            </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.group}>
              <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.submit}>
              Create Account
            </button>
          </form>

          <div className={styles.divider} />

          <div className={styles.terms}>
            <p className={styles.termsText}>
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>




    </div>
  );
}