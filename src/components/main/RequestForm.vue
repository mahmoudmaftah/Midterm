<template>
  <div class="backdrop" @click.self="closeForm">
    <div class="request-form">
      <h3>Request Service: {{ service.serviceType }}</h3>
      <form @submit.prevent="submitRequest">
        <label for="amount">Proposed Amount:</label>
        <input type="number" v-model="amount" required />

        <label for="location">Location:</label>
        <input type="text" v-model="location" required />

        <label for="additionalInfo">Additional Info:</label>
        <textarea v-model="additionalInfo"></textarea>

        <button type="submit">Send Notification</button>
        <button type="button" @click="closeForm">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase/init';
import { collection, addDoc } from 'firebase/firestore';
import { ref } from 'vue';

export default {
  props: {
    service: Object,
    currentUser: Object,
  },
  setup(props, { emit }) {
    const amount = ref(0);
    const location = ref('');
    const additionalInfo = ref('');

    const submitRequest = async () => {
      const notificationRef = collection(db, 'notify');
      await addDoc(notificationRef, {
        status: 'pending',
        proposedAmount: amount.value,
        location: location.value,
        additionalInfo: additionalInfo.value,
        serviceId: props.service.id,
        serviceType: props.service.serviceType,
        ArtisanId: props.service.ArtisanId,
        userId: props.currentUser.uid,
      });
      alert('Notification sent successfully!');
      amount.value = 0;
      location.value = '';
      additionalInfo.value = '';
      emit('close');
    };

    const closeForm = () => {
      emit('close');
    };

    return {
      amount,
      location,
      additionalInfo,
      submitRequest,
      closeForm,
    };
  },
};
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.request-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
}

.request-form h3 {
  margin-top: 0;
}

.request-form label {
  display: block;
  margin-top: 10px;
}

.request-form input,
.request-form textarea {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.request-form button {
  margin-top: 15px;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.request-form button[type="submit"] {
  background-color: #4caf50;
  color: white;
}

.request-form button[type="button"] {
  background-color: #f44336;
  color: white;
  margin-left: 10px;
}
</style>
