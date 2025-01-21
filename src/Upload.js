import axios from 'axios';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import './Upload.css';

function Upload() {
  const [pname, setName] = useState('');
  const [pprice, setPrice] = useState('');
  const [pimage, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApi = async (e) => {
    e.preventDefault();
    console.log('Form Submitted:', { pname, pprice, pimage });

    if (!pname || !pprice || !pimage) {
      alert('Please fill out all fields and upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('pname', pname);
    formData.append('pprice', pprice);
    formData.append('pimage', pimage);

  console.log('FormData:', Array.from(formData.entries()));


    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:4000/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);
      alert(response.data);
      resetForm();
    } catch (error) {
      console.error('Error during API call:', error.response?.data || error.message);
      alert(error.response?.data || 'Error adding product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setImage(null);

    const fileInput = document.getElementById('formProductImage');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(to right, #6a11cb, #2575fc)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <Container
        style={{
          background: '#fff',
          borderRadius: '15px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
          padding: '30px',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <h3 className="text-center mb-4" style={{ color: '#333' }}>
          Upload Product
        </h3>
        <Form onSubmit={handleApi}>
          <Form.Group className="mb-3" controlId="formProductName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Product Name"
              value={pname}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProductPrice">
            <Form.Label>Product Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Product Price"
              value={pprice}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProductImage">
            <Form.Label>Product Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>
          <div className="text-center">
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '200px',
                padding: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: '25px',
                backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Adding...' : 'Add Now'}
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default Upload;
