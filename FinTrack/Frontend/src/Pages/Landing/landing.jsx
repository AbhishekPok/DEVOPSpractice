import {
  LayoutDashboard,
  CreditCard,
  PieChart,
  FileText,
  TrendingUp,
  Shield,
  Target,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Lock
} from 'lucide-react';
import { IconCurrencyRupeeNepalese } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import styles from './landing.module.css';

export default function LandingPage({ onGetStarted, onLogin }) {
  const navigate = useNavigate();
  const features = [
    {
      icon: LayoutDashboard,
      title: 'Smart Dashboard',
      description: 'Get a complete overview of your financial health with real-time balance tracking and spending summaries.',
    },
    {
      icon: CreditCard,
      title: 'Transaction Management',
      description: 'Easily add, edit, and categorize all your transactions with powerful search and filtering tools.',
    },
    {
      icon: PieChart,
      title: 'AI-Powered Insights',
      description: 'Discover spending patterns with intelligent clustering analysis and personalized recommendations.',
    },
    {
      icon: FileText,
      title: 'Custom Reports',
      description: 'Generate detailed financial reports and export them to CSV or PDF for easy record-keeping.',
    },
    {
      icon: TrendingUp,
      title: 'Trend Analysis',
      description: 'Visualize your spending trends over time with interactive charts and graphs.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is protected with industry-standard security and encryption.',
    }
  ];

  const benefits = [
    'Track income and expenses effortlessly',
    'Understand your spending patterns',
    'Set and achieve financial goals',
    'Export reports for tax preparation',
    'Access from any device',
    'No credit card required to start'
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '$2M+', label: 'Tracked Transactions' },
    { value: '95%', label: 'User Satisfaction' },
    { value: '24/7', label: 'Support Available' }
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <IconCurrencyRupeeNepalese className={styles.logoIcon} />
            <h1 className={styles.logoText}>FinTrack</h1>
          </div>
          <div className={styles.headerButtons}>
            <button className={styles.getStartedBtn} onClick={() => { navigate("/login") }}>
              Sign In
              <ArrowRight className={styles.btnIcon} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <h2 className={styles.heroTitle}>
              Take Control of Your
              <span className={styles.heroAccent}>Financial Future</span>
            </h2>
            <p className={styles.heroText}>
              FinTrack helps you manage your money smarter with intelligent insights,
              automated tracking, and beautiful visualizations. Start making better
              financial decisions today.
            </p>
            <div className={styles.heroButtons}>
              <button className={styles.primaryBtn} onClick={() => { navigate("/register") }}>
                Get Started
                <ArrowRight className={styles.btnIcon} />
              </button>
              <button className={styles.secondaryBtn} onClick={() => { navigate("/login") }}>
                Sign In
              </button>
            </div>
            <div className={styles.heroFeatures}>
              <div className={styles.feature}>
                <CheckCircle2 className={styles.featureIcon} />
                <span>No credit card required</span>
              </div>
              <div className={styles.feature}>
                <Lock className={styles.featureIcon} />
                <span>Bank-level security</span>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.heroImage}>
              <img
                src="https://images.unsplash.com/photo-1763038311036-6d18805537e5?w=800"
                alt="FinTrack Dashboard"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <div className={styles.statValue}>{stat.value}</div>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <div className={styles.smallBadge}>Features</div>
          <h2 className={styles.sectionTitle}>
            Everything You Need to Manage Your Money
          </h2>
          <p className={styles.sectionText}>
            Powerful features designed to give you complete control over your finances,
            from daily transactions to long-term planning.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIconBox}>
                  <Icon className={styles.featureCardIcon} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureText}>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <div className={styles.smallBadge}>How It Works</div>
          <h2 className={styles.sectionTitle}>
            Get Started in 3 Simple Steps
          </h2>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepIconBox}>
              <Target className={styles.stepIcon} />
            </div>
            <h3 className={styles.stepTitle}>Create Your Account</h3>
            <p className={styles.stepText}>
              Sign up in seconds with just your email. No credit card needed to get started.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepIconBox}>
              <BarChart3 className={styles.stepIcon} />
            </div>
            <h3 className={styles.stepTitle}>Add Transactions</h3>
            <p className={styles.stepText}>
              Quickly add your income and expenses. Our smart categorization makes it easy.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepIconBox}>
              <TrendingUp className={styles.stepIcon} />
            </div>
            <h3 className={styles.stepTitle}>Get Insights</h3>
            <p className={styles.stepText}>
              Watch as AI analyzes your spending and provides actionable recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitsImage}>
            <img
              src="https://images.unsplash.com/photo-1723987251277-18fc0a1effd0?w=800"
              alt="Financial Analytics"
            />
          </div>

          <div className={styles.benefitsContent}>
            <div className={styles.smallBadge}>Benefits</div>
            <h2 className={styles.sectionTitle}>
              Why Choose FinTrack?
            </h2>
            <p className={styles.sectionText}>
              Join thousands of users who have taken control of their finances and
              achieved their financial goals with FinTrack.
            </p>
            <div className={styles.benefitsList}>
              {benefits.map((benefit, index) => (
                <div key={index} className={styles.benefitItem}>
                  <div className={styles.benefitCheck}>
                    <CheckCircle2 className={styles.checkIcon} />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            <button className={styles.primaryBtn} onClick={() => { navigate("/register") }}>
              Start Your Free Trial
              <ArrowRight className={styles.btnIcon} />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>
          Ready to Transform Your Financial Life?
        </h2>
        <p className={styles.ctaText}>
          Join thousands of users who are already managing their money smarter with FinTrack.
          Start your free trial today and experience the difference.
        </p>
        <div className={styles.ctaButtons}>
          <button className={styles.ctaBtn} onClick={() => { navigate("/register") }}>
            Get Started Free
            <ArrowRight className={styles.btnIcon} />
          </button>
          <button className={styles.ctaBtnOutline} onClick={() => { navigate("/login") }}>
            Sign In
          </button>
        </div>
        <p className={styles.ctaNote}>
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>
                <IconCurrencyRupeeNepalese></IconCurrencyRupeeNepalese>
                <span>FinTrack</span>
              </div>
              <p className={styles.footerBrandText}>
                Empowering you to take control of your financial future with intelligent tracking and insights.
              </p>
            </div>

            <div className={styles.footerColumn}>
              <h4 className={styles.footerHeading}>Product</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Security</a></li>
                <li><a href="#">Roadmap</a></li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4 className={styles.footerHeading}>Company</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4 className={styles.footerHeading}>Legal</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>&copy; 2025 FinTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}