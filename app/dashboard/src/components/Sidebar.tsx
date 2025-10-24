import Link from 'next/link';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/', label: 'Overview' },
  { href: '/onboarding', label: 'Onboarding' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/flows', label: 'Flows' },
  { href: '/settings', label: 'Settings' },
];

export const Sidebar = () => (
  <aside className={styles.sidebar}>
    <h1>Chatbot Admin</h1>
    <nav>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} className={styles.link}>
          {item.label}
        </Link>
      ))}
    </nav>
  </aside>
);
