const student = {
  name: "ชื่อ นาย กิตติทัต นามสกุล กันธรรม",
  studentId: "รหัสนักศึกษา 68543210019-4",
  os: process.platform,
  node: process.version,
};

function createGreeting({ name, studentId, os, node }) {
  return `Hello ${name} (${studentId}) | OS: ${os} | Node: ${node}`;
}

console.log(createGreeting(student));