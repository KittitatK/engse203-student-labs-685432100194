function PriorityBadge({ priority }) {
  if (priority === 'urgent') {
    return <span className="priority-urgent">เร่งด่วน</span>;
  }
  
  if (priority === 'normal') {
    return <span className="priority-normal">ปกติ</span>;
  }
  
  // จัดการ Edge case: ถ้าเป็นค่าอื่นๆ หรือ undefined
  return <span className="priority-unknown">ไม่ระบุ</span>;
}

export default PriorityBadge;