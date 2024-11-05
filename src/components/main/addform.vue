<template>
    <div class="add-service-form">
      <h2>Add a New Service</h2>
      <form @submit.prevent="addService">
        <div class="form-group">
          <label for="serviceType">Service Type:</label>
          <select v-model="serviceType" required>
            <option value="" disabled>Select a service type</option>
            <option v-for="type in serviceTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="rating">Rating (1-5):</label>
          <input type="number" v-model="rating" min="1" max="5" required />
        </div>
        <div class="form-group">
          <label for="yearsExperience">Years of Experience:</label>
          <input type="number" v-model="yearsExperience" min="0" required />
        </div>
        <button type="submit">Add Service</button>
      </form>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="success" class="success">{{ success }}</div>
    </div>
  </template>
  
  <script>
  import { auth, db } from '@/firebase/init';
  import { collection, addDoc } from 'firebase/firestore';
  
  export default {
    data() {
      return {
        serviceType: '',
        rating: null,
        yearsExperience: null,
        error: '',
        success: '',
        serviceTypes: ['Plumbing', 'Electrical', 'Cleaning', 'Landscaping', 'Painting'], // Predefined service types
      };
    },
    methods: {
      async addService() {
        this.error = '';
        this.success = '';
        
        try {
          const docRef = await addDoc(collection(db, 'services'), {
            serviceType: this.serviceType,
            rating: this.rating,
            yearsExperience: this.yearsExperience,
            createdAt: new Date(),
            ArtisanId: auth.currentUser.uid,
          });
          this.success = 'Service added successfully!';
          this.resetForm();
        } catch (e) {
          this.error = 'Error adding service: ' + e.message;
        }
      },
      resetForm() {
        this.serviceType = '';
        this.rating = null;
        this.yearsExperience = null;
      },
    },
  };
  </script>
  
  <style scoped>
  .add-service-form {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  select, input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  select:focus, input:focus {
    border-color: #007bff;
    outline: none;
  }
  
  button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .error {
    color: red;
    margin-top: 10px;
    text-align: center;
  }
  
  .success {
    color: green;
    margin-top: 10px;
    text-align: center;
  }
  </style>
  