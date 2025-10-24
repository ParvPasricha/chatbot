import styles from './Navbar.module.css';

interface NavbarProps {
  title: string;
}

export const Navbar = ({ title }: NavbarProps) => (
  <header className={styles.navbar}>
    <h2>{title}</h2>
    <div className={styles.actions}>
      <button type="button">Create Flow</button>
      <button type="button" className={styles.primary}>Sync Data</button>
    </div>
  </header>
);
