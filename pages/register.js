import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/register.module.css';

export default function RegisterPage() {
    const router = useRouter();
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [selectedFile, setSelectedFile] = useState(null);
    const defaultImage = '../บวก.jpg';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const formDataToSend = new FormData();
        formDataToSend.append('firstName', formData.firstname);
        formDataToSend.append('lastName', formData.lastname);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('university', formData.university);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('age', formData.age);
        formDataToSend.append('picture', formData.studentIdCard);

        try {
            const response = await fetch('/api/customers', {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                const data = await response.json();
                alert('Registration successful! Redirecting to login page...');
                router.push('/login');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setError('An unexpected error occurred. Please try again.');
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
                <h2 className={styles.title}>Register</h2>
                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}
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
                            placeholder="First Name"
                            disabled={isLoading}
                        />
                        <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            className={styles.inputField}
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                            placeholder="Last Name"
                            disabled={isLoading}
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
                            disabled={isLoading}
                        />
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
                    </div>
                    <input
                        type="text"
                        id="university"
                        name="university"
                        className={`${styles.inputField} ${styles.university}`}
                        value={formData.university}
                        onChange={handleChange}
                        required
                        placeholder="University"
                        disabled={isLoading}
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
                            placeholder="Customer ID"
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
                            placeholder="Password"
                            disabled={isLoading}
                        />
                    </div>
                    <div className={styles.fileUpload}>
                        <input
                            type="file"
                            id="studentIdCard"
                            name="studentIdCard"
                            accept=".jpg, .jpeg, .png, .pdf"
                            onChange={handleFileChange}
                            required
                            disabled={isLoading}
                        />
                        <label htmlFor="studentIdCard">
                            {selectedFile ? (
                                <img src={selectedFile} alt="Selected file" />
                            ) : (
                                <img src={defaultImage} alt="Default ID Card" />
                            )}
                        </label>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button
                            type="submit"
                            className={styles.button}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
                <div className={styles.footer}>
                    <p>
                        Already have an account?{' '}
                        <Link href="/login" className={styles.linkButton}>
                            Click here to login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}