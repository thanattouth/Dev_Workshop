// pages/register.js
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/login.module.css'; // นำเข้า CSS Module

export default function RegisterPage() {
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }, []);
  const [formData, setFormData] = useState({
    customerId: '',
    password: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // คุณสามารถจัดการกับการส่งฟอร์มที่นี่
    console.log(formData);
  };


 

  return (
    <div style={{ backgroundColor: '#F1E6D2', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
     <img src="/มุม1.jpg" alt="Logo" className={styles.topLeftImage} /> {/* เพิ่มรูปภาพที่มุมซ้ายบน */}
     <img src="/มุม2.jpg" alt="Description" className={styles.bottomRightImage} />
      <img src="/Chailai.jpg" alt="ChaiLai Ticket" className={styles.h1Title} /> {/* แทนที่ h1 ด้วย img */}
      <div className={styles.container}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleSubmit}>
  
  
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
 
 <div className={styles.footer}>
        <p>
          Forgot password? <Link href="../pages/register.js">Don’t have an account.</Link>
        </p>
      </div>
  <div className={styles.buttonContainer}> {/* เพิ่ม container สำหรับจัดปุ่ม */}
  <button type="submit" className={styles.button}>Login</button>
</div>

</form>
      
    </div>
  </div>
);
}