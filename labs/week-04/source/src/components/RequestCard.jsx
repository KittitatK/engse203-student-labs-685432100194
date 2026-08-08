function RequestCard({ request, onDeleteRequest }) {
  // ฟังก์ชันช่วยแปลง status เป็นข้อความภาษาไทยและ CSS Class ที่ตรงกัน
  function getStatusDisplay(status) {
    switch (status) {
      case 'pending':
        return { text: 'รอดำเนินการ', cssClass: 'badge-pending' };
      case 'in-progress':
        return { text: 'กำลังดำเนินการ', cssClass: 'badge-in-progress' };
      case 'completed':
        return { text: 'เสร็จสิ้น', cssClass: 'badge-completed' };
      default:
        return { text: status, cssClass: '' };
    }
  }

  const statusDisplay = getStatusDisplay(request.status);

  return (
    <article className="request-card">
      <div>
        {/* แถวสำหรับแสดง Badge สถานะ และ ความเร่งด่วน */}
        <div className="badge-row">
          <span className={`badge ${statusDisplay.cssClass}`}>
            {statusDisplay.text}
          </span>
          
          {/* เงื่อนไขแสดงป้ายความเร่งด่วน: ด่วน = สีแดง, ปกติ = สีเขียว */}
          {request.priority === 'urgent' ? (
            <span className="badge priority-high">ด่วน</span>
          ) : (
            <span className="badge priority-normal">ปกติ</span>
          )}
        </div>

        <p className="request-id">{request.id}</p>
        <h3>{request.requestType}</h3>
        <p>{request.location}</p>
        <p>{request.details}</p>
      </div>
      <button type="button" onClick={() => onDeleteRequest(request.id)}>
        ลบ
      </button>
    </article>
  );
}

export default RequestCard;