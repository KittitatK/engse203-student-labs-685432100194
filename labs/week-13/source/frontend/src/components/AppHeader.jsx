import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const links = [
  ['/', 'Dashboard'],
  ['/requests/new', 'New Request'],
  ['/about', 'About'],
];

function AppHeader() {
  const { user, isStaff, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div>
          <p className="eyebrow">ENGSE203 • LAB 05</p>
          <p className="brand">Campus Service Request</p>
        </div>
        <nav aria-label="เมนูหลัก">
          {links.map(([to, label]) => (
            <NavLink
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              end={to === '/'}
              key={to}
              to={to}
            >
              {label}
            </NavLink>
          ))}
          {isStaff ? (
            <button
              type="button"
              className="nav-link"
              onClick={logout}
              style={{
                background: 'transparent',
                cursor: 'pointer',
                font: 'inherit',
                textAlign: 'center',
              }}
              title="ออกจากระบบ"
            >
              ออกจากระบบ ({user?.name || 'เจ้าหน้าที่ฝ่ายบริการ'})
            </button>
          ) : (
            <NavLink
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              to="/login"
            >
              เจ้าหน้าที่
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default AppHeader;
