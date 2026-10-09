import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { login, register } from '../services/authService.js';

function LoginPage() {
  const navigate = useNavigate();
  const { user, isStaff, logout } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register(email, password, name || 'เจ้าหน้าที่');
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  }

  function fillDemoStaff() {
    setEmail('staff@rmutl.ac.th');
    setPassword('staff1234');
    setIsRegisterMode(false);
  }

  if (isStaff && user) {
    return (
      <section data-testid="page-login">
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <div className="panel state-card" style={{ maxWidth: '30rem', width: '100%' }}>
            <p className="eyebrow dark">STAFF ONLY</p>
            <h1>เข้าสู่ระบบแล้ว</h1>
            <p>
              สวัสดีคุณ <strong>{user.name}</strong> (สถานะ: เจ้าหน้าที่)
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              <Link to="/" className="button primary inline">
                ไปที่ Dashboard
              </Link>
              <button
                type="button"
                className="button danger"
                onClick={() => logout()}
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section data-testid="page-login">
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">STAFF ONLY</p>
          <h1>{isRegisterMode ? 'ลงทะเบียนเจ้าหน้าที่' : 'เข้าสู่ระบบเจ้าหน้าที่'}</h1>
          <p>เปลี่ยนสถานะและลบคำร้องได้หลังเข้าสู่ระบบ</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <section className="panel form-panel" style={{ width: '100%', maxWidth: '30rem' }}>
          <form onSubmit={handleSubmit}>
            {errorMessage && (
              <div
                className="error"
                style={{
                  background: '#feeceb',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                  fontWeight: 600,
                }}
              >
                {errorMessage}
              </div>
            )}

            {isRegisterMode && (
              <div className="field">
                <label htmlFor="name-input">ชื่อ-นามสกุล</label>
                <input
                  id="name-input"
                  type="text"
                  placeholder="เช่น สมศักดิ์ ใจเย็น"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="field">
              <label htmlFor="email-input">อีเมล</label>
              <input
                id="email-input"
                type="email"
                required
                placeholder="staff@rmutl.ac.th"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="password-input">รหัสผ่าน</label>
              <input
                id="password-input"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="button primary"
              style={{ width: '100%', marginTop: '0.75rem' }}
              disabled={loading}
            >
              {loading
                ? 'กำลังทำรายการ…'
                : isRegisterMode
                ? 'ลงทะเบียนเจ้าหน้าที่'
                : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                type="button"
                className="button secondary"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
                onClick={fillDemoStaff}
              >
                กรอกบัญชีทดสอบ
              </button>

              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--blue)',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  textDecoration: 'underline',
                  padding: 0,
                }}
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setErrorMessage('');
                }}
              >
                {isRegisterMode ? 'มีบัญชีแล้ว? เข้าสู่ระบบ' : 'ลงทะเบียนเจ้าหน้าที่ใหม่'}
              </button>
            </div>
            {!isRegisterMode && (
              <p style={{ margin: '0.75rem 0 0', fontSize: '0.82rem', color: 'var(--muted)', textAlign: 'center' }}>
                บัญชีทดสอบ: <code>staff@rmutl.ac.th</code> / <code>staff1234</code>
              </p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

export default LoginPage;
