import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const defaultImage = '../บวก.jpg';

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      studentIdCard: file,
    });
    setSelectedFile(URL.createObjectURL(file));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
      return false;
    }
    
    // Password validation (8 digits)
    if (!/^\d{8}$/.test(formData.password)) {
      setError('รหัสผ่านต้องเป็นตัวเลข 8 หลัก');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'เข้าสู่ระบบไม่สำเร็จ');
      }

      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      // Redirect to dashboard/home page after successful login
      // router.push('/dashboard'); // Adjust this route as needed
      
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F1E6D2', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <img src="/มุม1.jpg" alt="Logo" className={styles.topLeftImage} />
      <img src="/มุม2.jpg" alt="Description" className={styles.bottomRightImage} />
      <img src="/Chailai.jpg" alt="ChaiLai Ticket" className={styles.h1Title} />
      
      <div className={styles.container}>
        <h2 className={styles.title}>Login</h2>
        
        {error && (
          <div className={`${styles.errorMessage}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.inputField}
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email"
            disabled={isLoading}
          />
          
          <input
            type="password"
            id="password"
            name="password"
            className={styles.inputField}
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Password (8 digits)"
            disabled={isLoading}
          />

          <div className={styles.footer}>
            <p>
              Forgot password? <Link href="/register">Don't have an account?</Link>
            </p>
          </div>

          <div className={styles.buttonContainer}>
            <button 
              type="submit" 
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}