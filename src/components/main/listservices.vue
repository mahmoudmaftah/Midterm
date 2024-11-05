<template>
    <div class="view-services">
      <h2>Available Services</h2>
      
      <div class="controls">
        <label for="limite">Limit:</label>
        <select v-model="limite" @change="fetchServices">
          <option v-for="option in limitOptions" :key="option" :value="option">{{ option }}</option>
        </select>
  
        <label for="criterion">Order By:</label>
        <select v-model="criterion" @change="fetchServices">
          <option value="rating">Rating</option>
          <option value="yearsExperience">Years of Experience</option>
        </select>
      </div>
  
      <div class="search-filters">
        <label for="minRating">Minimum Rating:</label>
        <input type="number" v-model="minRating" @input="filterServices" min="0" max="5" step="0.1" />
  
        <label for="minExperience">Minimum Years of Experience:</label>
        <input type="number" v-model="minExperience" @input="filterServices" min="0" />
  
        <label for="serviceType">Type of Service:</label>
        <select v-model="serviceType" @change="fetchServices">
          <option value="">Select a service type</option>
          <option v-for="type in serviceTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
  
      <div v-if="loading" class="loading">Loading services...</div>
      <div v-if="error" class="error">{{ error }}</div>
      
      <ul v-if="filteredServices.length > 0" class="service-list">
        <li v-for="service in filteredServices" :key="service.id" class="service-item">
          <h3>{{ service.serviceType }}</h3>
          <p>Rating: {{ service.rating }}</p>
          <p>Years of Experience: {{ service.yearsExperience }}</p>
          <button @click="openRequestForm(service)">Request Service</button>
        </li>
      </ul>
      <div v-else class="no-services">No services available at the moment.</div>
  
      <RequestForm 
        v-if="requestFormVisible" 
        @close="requestFormVisible = false"
        :service="selectedService"
        :currentUser="currentUser"
      />
    </div>
  </template>
  
  <script>
  import { auth, db } from '@/firebase/init';
  import { collection, query, onSnapshot, where } from 'firebase/firestore';
  import { ref, onMounted, onUnmounted } from 'vue';
  import RequestForm from './RequestForm.vue'; // Import the RequestForm component
  
  export default {
    components: {
      RequestForm, // Register the component
    },
    setup() {
      const services = ref([]);
      const filteredServices = ref([]);
      const loading = ref(true);
      const error = ref('');
      const limite = ref(5);
      const criterion = ref('rating');
      const limitOptions = [5, 10, 15, 20];
      
      const minRating = ref(0);
      const minExperience = ref(0);
      const serviceType = ref('');
      
      // Include "Any" in service types
      const serviceTypes = ['Plumbing', 'Electrical', 'Cleaning', 'Landscaping', 'Painting', 'Any'];
  
      const currentUser = auth.currentUser; // Get current user
      const requestFormVisible = ref(false);
      const selectedService = ref(null);
  
      const fetchServices = () => {
        loading.value = true;
        error.value = '';
  
        const servicesRef = collection(db, 'services');
        const q = serviceType.value && serviceType.value !== 'Any'
          ? query(servicesRef, where('serviceType', '==', serviceType.value))
          : query(servicesRef); // Fetch all if "Any" is selected
  
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          services.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          loading.value = false;
          filterServices(); // Apply additional filters after fetching
        }, (err) => {
          error.value = 'Error fetching services: ' + err.message;
          loading.value = false;
        });
  
        onUnmounted(() => {
          unsubscribe();
        });
      };
  
      const filterServices = () => {
        filteredServices.value = services.value.filter(service => {
          return (
            (minRating.value === 0 || service.rating >= minRating.value) &&
            (minExperience.value === 0 || service.yearsExperience >= minExperience.value)
          );
        }).sort((a, b) => {
          return b[criterion.value] - a[criterion.value]; // Sort based on selected criterion
        }).slice(0, limite.value); // Limit the results
      };
  
      const openRequestForm = (service) => {
        selectedService.value = service;
        requestFormVisible.value = true;
      };
  
      onMounted(fetchServices);
  
      return {
        services,
        filteredServices,
        loading,
        error,
        limite,
        criterion,
        limitOptions,
        minRating,
        minExperience,
        serviceType,
        serviceTypes,
        fetchServices,
        filterServices,
        openRequestForm,
        currentUser,
        requestFormVisible,
        selectedService,
      };
    },
  };
  </script>
  
  <style scoped>
  .view-services {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    color: #333;
  }
  
  .controls {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  
  .search-filters {
    margin-bottom: 20px;
  }
  
  label {
    margin-right: 10px;
    font-weight: bold;
  }
  
  input, select {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  
  .loading {
    text-align: center;
    font-style: italic;
  }
  
  .error {
    color: red;
    text-align: center;
    font-weight: bold;
  }
  
  .service-list {
    list-style-type: none;
    padding: 0;
  }
  
  .service-item {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
    background-color: #fff;
  }
  
  .no-services {
    text-align: center;
    color: #666;
    font-style: italic;
  }
  </style>