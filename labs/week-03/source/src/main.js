import './style.css';

const form = document.querySelector('#request-form');
const detailsCount = document.querySelector('#details-count');
const status = document.querySelector('#form-status'); 
const requestList = document.querySelector('#request-list');
const previewPanel = document.querySelector('.preview-panel');

// ดึง HTML Elements สำหรับ Preview ฝั่งขวา
const preview = {
  displayName: document.querySelector('#preview-name'),
  type: document.querySelector('#preview-type'),      
  details: document.querySelector('#preview-details'), 
};

// ฟังก์ชันอ่านข้อมูลจากฟอร์ม
function readForm() {
  return Object.fromEntries(new FormData(form).entries());
}

// ฟังก์ชันแสดงผล Live Preview
function renderPreview(data) {
  preview.displayName.textContent = data.requesterName?.trim() || 'ยังไม่ระบุชื่อ';
  preview.type.textContent = data.requestType || 'ยังไม่เลือกประเภท';
  preview.details.textContent = data.requestDetails?.trim() || 'ยังไม่มีรายละเอียด';
  
  // นับจำนวนตัวอักษร
  if (detailsCount && data.requestDetails !== undefined) {
    detailsCount.textContent = `${data.requestDetails.length} ตัวอักษร`;
  }
}

// ฟังก์ชันตรวจสอบความถูกต้องของข้อมูล
function validate(data) {
  const errors = {};

  if (data.requesterName?.trim().length < 2) {
    errors.requesterName = 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร';
  }

  if (!data.requestType) {
    errors.requestType = 'กรุณาเลือกประเภท';
  }

  if (data.requestDetails?.trim().length < 10) {
    errors.requestDetails = 'กรุณาเขียนรายละเอียดอย่างน้อย 10 ตัวอักษร';
  }

  return errors;
}

// ฟังก์ชันแสดงข้อความแจ้งเตือน Error และขอบสีแดง/เขียว
function renderErrors(errors) {
  for (const name of ['requesterName', 'requestType', 'requestDetails']) {
    const field = form.elements[name];
    const output = document.querySelector(`#${name}-error`);
    const message = errors[name] ?? '';

    if (output) output.textContent = message;
    
    // จัดการเฉพาะกล่อง Input ฝั่งซ้าย (แดงเมื่อผิด, เขียวเมื่อถูก)
    if (field) {
      if (message) {
        field.setAttribute('aria-invalid', 'true');
      } else if (field.value.trim() !== '') {
        field.setAttribute('aria-invalid', 'false');
      } else {
        field.removeAttribute('aria-invalid');
      }
    }
  }
}

// ฟังก์ชันแสดงสถานะ และสั่งเปลี่ยนสีกล่อง Live Preview ท้งกล่อง
function renderStatus(state, message) {
  if (status) {
    status.dataset.state = state;
    status.textContent = message;
  }
  
  if (previewPanel) {
    previewPanel.dataset.state = state; 
  }
}

// ฟังก์ชันสร้างรายการแจ้งซ่อม (แสดงเพียงรายการเดียว เป็นการ์ดสีขาว)
function addRequestToList(data) {
  if (!requestList) return;
  
  // ล้างข้อมูลเก่าทิ้งทั้งหมด
  requestList.innerHTML = '';
  
  const li = document.createElement('li');
  // ตกแต่งให้เป็นการ์ดสีขาว
  li.style.backgroundColor = 'white';
  li.style.padding = '1.2rem';
  li.style.borderRadius = 'var(--radius-md)';
  li.style.border = '1px solid var(--border-color)';
  li.style.marginTop = '1rem';
  li.style.boxShadow = 'var(--shadow-sm)';
  li.style.wordBreak = 'break-all'; // ป้องกันตัวอักษรล้นในการ์ดด้านล่าง
  
  li.innerHTML = `
    <div style="font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; font-size: 1.05rem;">
      ${data.requesterName.trim()} • ${data.requestType}
    </div>
    <div style="color: var(--text-muted); font-size: 0.95rem; white-space: pre-wrap;">
      ${data.requestDetails.trim()}
    </div>
  `;
  
  requestList.appendChild(li);
}

// Event Listeners ตอนกำลังพิมพ์
form.addEventListener('input', () => {
  const data = readForm();      
  renderPreview(data);          
  const errors = validate(data);
  renderErrors(errors);         
});

// Event Listeners ตอนกด Submit
form.addEventListener('submit', (event) => {
  event.preventDefault(); 
  
  const data = readForm();
  const errors = validate(data);
  renderErrors(errors);

  // 1. กรณีข้อมูลผิด
  if (Object.keys(errors).length > 0) {
    renderStatus('invalid', '❌ ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบช่องสีแดงอีกครั้ง');
    form.querySelector('[aria-invalid="true"]')?.focus(); 
    return; 
  }

  // 2. กรณีข้อมูลถูกต้อง
  console.log('บันทึกข้อมูลสำเร็จ:', data);
  addRequestToList(data); 
  
  // สั่งล้างฟอร์ม
  form.reset();

  // หน่วงเวลาให้กล่องขวาแสดงเป็นสีเขียวหลังจากรีเซ็ตฟอร์ม
  setTimeout(() => {
    renderStatus('success', `✅ บันทึกคำขอเรียบร้อย`);
  }, 10);
});

// Event Listeners ตอนรีเซ็ตฟอร์ม
form.addEventListener('reset', () => {
  queueMicrotask(() => {
    renderErrors({});
    renderPreview(readForm());
    renderStatus('idle', 'พร้อมเริ่มกรอกข้อมูลใหม่');
  });
});

// เริ่มการทำงานครั้งแรกเมื่อเปิดหน้าเว็บ
renderPreview(readForm());
renderStatus('idle', 'เริ่มพิมพ์เพื่อทดลอง Event และ Live Preview');