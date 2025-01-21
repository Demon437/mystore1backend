function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleRegister = async () => {
      try {
        const response = await axios.post('http://localhost:4000/register', {
          email,
          password,
        });
        alert('Registration successful!');
      } catch (error) {
        console.error(error);
        alert('Registration failed!');
      }
    };
  }
  