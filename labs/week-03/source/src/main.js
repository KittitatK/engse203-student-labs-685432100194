import './style.css'

const form = document.getElementById('request-form')
const nameInput = document.getElementById('requester-name')
const typeSelect = document.getElementById('request-type')
const detailsTextarea = document.getElementById('request-details')

const nameError = document.getElementById('requesterName-error')
const typeError = document.getElementById('requestType-error')
const detailsError = document.getElementById('requestDetails-error')
const detailsCount = document.getElementById('details-count')

const formStatus = document.getElementById('form-status')

const previewName = document.getElementById('preview-name')
const previewType = document.getElementById('preview-type')
const previewDetails = document.getElementById('preview-details')
const previewPanel = document.querySelector('.preview-panel')

const requestList = document.getElementById('request-list')

function validateName() {
  const value = nameInput.value.trim()
  if (value.length < 2) {
    nameInput.setAttribute('aria-invalid', 'true')
    nameError.textContent = 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร'
    return false
  }
  nameInput.setAttribute('aria-invalid', 'false')
  nameError.textContent = ''
  return true
}

function validateType() {
  const value = typeSelect.value
  if (!value) {
    typeSelect.setAttribute('aria-invalid', 'true')
    typeError.textContent = 'กรุณาเลือกประเภทคำขอ'
    return false
  }
  typeSelect.setAttribute('aria-invalid', 'false')
  typeError.textContent = ''
  return true
}

function validateDetails() {
  const value = detailsTextarea.value.trim()
  const len = value.length
  detailsCount.textContent = `${len} ตัวอักษร`

  if (len < 10 || len > 111) {
    detailsTextarea.setAttribute('aria-invalid', 'true')
    detailsError.textContent = 'กรุณากรอกรายละเอียดระหว่าง 10-111 ตัวอักษร'
    return false
  }
  detailsTextarea.setAttribute('aria-invalid', 'false')
  detailsError.textContent = ''
  return true
}

function updatePreview() {
  const name = nameInput.value.trim()
  const type = typeSelect.value
  const details = detailsTextarea.value.trim()

  previewName.textContent = name || 'ยังไม่ระบุชื่อ'
  previewType.textContent = type || 'ยังไม่เลือกประเภท'
  previewDetails.textContent = details || 'ยังไม่มีรายละเอียด'
}

nameInput.addEventListener('input', () => {
  validateName()
  updatePreview()
})

typeSelect.addEventListener('change', () => {
  validateType()
  updatePreview()
})

detailsTextarea.addEventListener('input', () => {
  validateDetails()
  updatePreview()
})

function addRequestToList(name, type, details) {
  const li = document.createElement('li')
  li.textContent = `${name} — ${type}: ${details}`
  requestList.prepend(li)
}

form.addEventListener('submit', (event) => {
  event.preventDefault()

  const isNameValid = validateName()
  const isTypeValid = validateType()
  const isDetailsValid = validateDetails()
  const isFormValid = isNameValid && isTypeValid && isDetailsValid

  if (!isFormValid) {
    formStatus.textContent = 'กรุณาตรวจสอบข้อมูลในฟอร์มให้ถูกต้องก่อน submit'
    formStatus.setAttribute('data-state', 'invalid')
    previewPanel.setAttribute('data-state', 'invalid')
    return
  }

  const name = nameInput.value.trim()
  const type = typeSelect.value
  const details = detailsTextarea.value.trim()

  addRequestToList(name, type, details)

  formStatus.textContent = 'ส่งคำขอสำเร็จแล้ว!'
  formStatus.setAttribute('data-state', 'success')
  previewPanel.setAttribute('data-state', 'success')

  form.reset()
  detailsCount.textContent = '0 ตัวอักษร'
  nameInput.removeAttribute('aria-invalid')
  typeSelect.removeAttribute('aria-invalid')
  detailsTextarea.removeAttribute('aria-invalid')
  nameError.textContent = ''
  typeError.textContent = ''
  detailsError.textContent = ''

  updatePreview()
})