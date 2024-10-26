// pages/register.js
import { useState, useEffect } from 'react';
import styles from '../styles/register.module.css'; // นำเข้า CSS Module

export default function RegisterPage() {
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }, []);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    age: '',
    email: '',
    university: '',
    customerId: '',
    password: '',
    studentIdCard: null,
  });

  const [selectedFile, setSelectedFile] = useState(null); // สถานะสำหรับเก็บไฟล์ที่เลือก
  const defaultImage = '../บวก.jpg'; // ใช้ path ที่สัมพันธ์กับ public

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      studentIdCard: file,
    });
    setSelectedFile(URL.createObjectURL(file)); // อัปเดตภาพที่เลือก
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('firstName', formData.firstname);
    formDataToSend.append('lastName', formData.lastname);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('university', formData.university);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('age', formData.age);
    formDataToSend.append('picture', formData.studentIdCard); // Append file

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        alert('Registration successful!'); // Success message
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <div style={{ backgroundColor: '#F1E6D2', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
     <img src="/มุม1.jpg" alt="Logo" className={styles.topLeftImage} /> {/* เพิ่มรูปภาพที่มุมซ้ายบน */}
     <img src="/มุม2.jpg" alt="Description" className={styles.bottomRightImage} />
      <img src="/Chailai.jpg" alt="ChaiLai Ticket" className={styles.h1Title} /> {/* แทนที่ h1 ด้วย img */}
      <div className={styles.container}>
        <h2 className={styles.title}>Register</h2>
        <form onSubmit={handleSubmit}>
  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
    <input
      type="text"
      id="firstname"
      name="firstname"
      className={styles.inputField}
      value={formData.firstname}
      onChange={handleChange}
      required
      placeholder="First Name" // แสดงข้อความเป็น placeholder
    />
    <input
      type="text"
      id="lastname"
      name="lastname"
      className={styles.inputField}
      value={formData.lastname}
      onChange={handleChange}
      required
      placeholder="Last Name" // แสดงข้อความเป็น placeholder
    />
  </div>
  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
    <input
    type="number" 
    id="age" 
    name="age" 
    className={styles.inputField}
    value={formData.age} 
    onChange={handleChange}
    required
    placeholder="Age" 
    /> 
    <input
      type="email"
      id="email"
      name="email"
      className={styles.inputField}
      value={formData.email}
      onChange={handleChange}
      required
      placeholder="Email" // แสดงข้อความเป็น placeholder
    />
    </div>
    <input
        type="text"
        id="university"
        name="university"
        className={`${styles.inputField} ${styles.university}`} // เพิ่ม class university
        value={formData.university}
        onChange={handleChange}
        required
        placeholder="University" // แสดงข้อความเป็น placeholder
        />

  

  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
    <input
      type="int"
      id="customerId"
      name="customerId"
      className={styles.inputField}
      value={formData.customerId}
      onChange={handleChange}
      required
      placeholder="Customer ID" // แสดงข้อความเป็น placeholder
    />
    <input
      type="password"
      id="password"
      name="password"
      className={styles.inputField}
      value={formData.password}
      onChange={handleChange}
      required
      placeholder="Password" // แสดงข้อความเป็น placeholder
    />
  </div>
        {/* ใช้ label เพื่อสร้างปุ่มเลือกไฟล์ */}
  <div className={styles.fileUpload}>
  <input
  type="file"
  id="studentIdCard"
  name="studentIdCard"
  accept=".jpg, .jpeg, .png, .pdf"  // อนุญาตให้รับไฟล์ JPG, PNG และ PDF
  onChange={handleFileChange}
  required
/>

    <label htmlFor="studentIdCard">
      {selectedFile ? (
        <img src={selectedFile} alt="Selected file" /> // แสดงภาพที่เลือก
      ) : (
        <img src={defaultImage} alt="Default ID Card" /> // แสดงภาพเริ่มต้น
      )}
    </label>
  </div>

  <div className={styles.buttonContainer}> {/* เพิ่ม container สำหรับจัดปุ่ม */}
  <button type="submit" className={styles.button}>Register</button>
</div>

</form>
      <div className={styles.footer}>
        <p>
          Already had an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  </div>
);
}