import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import useManualReload from '../hooks/useManualReload.js';
import { getRequestById, updateRequestStatus } from '../services/requestService.js';

function RequestDetailPage() {
  const { requestId } = useParams();
  const [loadState, setLoadState] = useState('loading');
  const [request, setRequest] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, reload] = useManualReload();
  const [isUpdating, setUpdating] = useState(false);
  const [updateError, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    setLoadState('loading');
    getRequestById(requestId).then((result) => {
      if (ignore) return;
      setRequest(result);
      setLoadState('success');
    }).catch((error) => {
      if (ignore) return;
      setErrorMessage(error instanceof Error ? error.message : 'โหลดรายละเอียดไม่สำเร็จ');
      setLoadState('error');
    });
    return () => { ignore = true; };
  }, [requestId, reloadKey]);

  async function handleChangeStatus(nextStatus) {
    setUpdating(true);
    setError('');
    try {
      const updated = await updateRequestStatus(request.id, nextStatus);
      setRequest(updated);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'เปลี่ยนสถานะไม่สำเร็จ');
    } finally {
      setUpdating(false);
    }
  }

  return (
    <section data-testid="page-request-detail">
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">DYNAMIC ROUTE</p>
          <h1>รายละเอียดคำร้อง</h1>
          <p>Request ID: <code>{requestId}</code></p>
        </div>
      </div>
      {loadState === 'loading' && <LoadingState message="กำลังโหลดรายละเอียด…" />}
      {loadState === 'error' && <ErrorState message={errorMessage} onRetry={reload} />}
      {loadState === 'success' && !request && (
        <section className="state-card">
          <h2>ไม่พบคำร้อง</h2>
          <p>ไม่พบข้อมูลสำหรับ ID <code>{requestId}</code></p>
          <Link to="/">กลับ Dashboard</Link>
        </section>
      )}
      {loadState === 'success' && request && (
        <article className="panel detail-card">
          <h2>{request.requestType}</h2>
          <dl>
            <div><dt>ID</dt><dd>{request.id}</dd></div>
            <div><dt>ผู้แจ้ง</dt><dd>{request.requesterName}</dd></div>
            <div><dt>สถานที่</dt><dd>{request.location}</dd></div>
            <div><dt>รายละเอียด</dt><dd>{request.details}</dd></div>
            <div><dt>ความเร่งด่วน</dt><dd>{request.priority}</dd></div>
            <div>
              <dt>สถานะปัจจุบัน</dt>
              <dd><span className={`badge ${request.status}`}>{request.status}</span></dd>
            </div>
          </dl>

          <div style={{ margin: '1.5rem 0', padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '0.75rem', color: '#1f2937' }}>
              เปลี่ยนสถานะคำร้อง (Status Flow):
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="button"
                style={{
                  backgroundColor: request.status === 'pending' ? '#f59e0b' : '#fff',
                  color: request.status === 'pending' ? 'white' : '#374151',
                  border: request.status === 'pending' ? 'none' : '1px solid #d1d5db',
                  cursor: request.status === 'pending' ? 'default' : 'pointer',
                  fontWeight: request.status === 'pending' ? 'bold' : 'normal'
                }}
                onClick={() => handleChangeStatus('pending')}
                disabled={isUpdating || request.status === 'pending'}
              >
                {request.status === 'pending' ? '✓ รอดำเนินการ (pending)' : 'รอดำเนินการ (pending)'}
              </button>

              <button
                type="button"
                className="button in-progress"
                style={{
                  backgroundColor: request.status === 'in-progress' ? '#0d9488' : '#fff',
                  color: request.status === 'in-progress' ? 'white' : '#374151',
                  border: request.status === 'in-progress' ? 'none' : '1px solid #d1d5db',
                  cursor: request.status === 'in-progress' ? 'default' : 'pointer',
                  fontWeight: request.status === 'in-progress' ? 'bold' : 'normal'
                }}
                onClick={() => handleChangeStatus('in-progress')}
                disabled={isUpdating || request.status === 'in-progress'}
              >
                {request.status === 'in-progress' ? '✓ กำลังดำเนินการ (in-progress)' : 'กำลังดำเนินการ (in-progress)'}
              </button>

              <button
                type="button"
                className="button completed"
                style={{
                  backgroundColor: request.status === 'completed' ? '#16a34a' : '#fff',
                  color: request.status === 'completed' ? 'white' : '#374151',
                  border: request.status === 'completed' ? 'none' : '1px solid #d1d5db',
                  cursor: request.status === 'completed' ? 'default' : 'pointer',
                  fontWeight: request.status === 'completed' ? 'bold' : 'normal'
                }}
                onClick={() => handleChangeStatus('completed')}
                disabled={isUpdating || request.status === 'completed'}
              >
                {request.status === 'completed' ? '✓ เสร็จสิ้น (completed)' : 'เสร็จสิ้น (completed)'}
              </button>
            </div>
            {isUpdating && <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.9rem' }}>กำลังบันทึกสถานะใหม่ลงฐานข้อมูล…</p>}
            {updateError && <p style={{ color: '#dc2626', marginTop: '0.5rem', fontSize: '0.9rem' }}>{updateError}</p>}
          </div>

          <Link className="button inline" to="/">กลับ Dashboard</Link>
        </article>
      )}
    </section>
  );
}

export default RequestDetailPage;
