function PriorityBadge({ priority }) {
  const isUrgent = priority === 'urgent';
  
  return (
    <span className={isUrgent ? 'priority-urgent' : 'priority-normal'}>
      {isUrgent ? 'เร่งด่วน' : 'ปกติ'}
    </span>
  );
}

export default PriorityBadge;