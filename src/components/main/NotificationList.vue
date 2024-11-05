<template>
  <div class="notifications-list">
    <h2>Your Notifications</h2>

    <div v-if="loading" class="loading">Loading notifications...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Filter buttons -->
    <div class="filter-buttons">
      <button @click="filterNotifications('all')">All</button>
      <button @click="filterNotifications('pending')">Pending</button>
      <button @click="filterNotifications('accepted')">Accepted</button>
      <button @click="filterNotifications('denied')">Denied</button>
    </div>

    <!-- Toggle between issued and received notifications -->
    <div class="toggle-buttons">
      <button @click="toggleNotificationView('issued')">Notifications I Issued</button>
      <button @click="toggleNotificationView('received')">Notifications I Received</button>
    </div>

    <ul v-if="filteredNotifications.length > 0" class="notification-list">
      <li v-for="notification in filteredNotifications" :key="notification.id" class="notification-item">
        <p><strong>Service:</strong> {{ notification.serviceType }}</p>
        <p><strong>Status:</strong>
          <span :class="{
            'status-accepted': notification.status === 'accepted',
            'status-denied': notification.status === 'denied'
          }">
            {{ notification.status === 'pending' ? 'Pending' : notification.status }}
          </span>
        </p>
        <p><strong>Proposed Amount:</strong> ${{ notification.proposedAmount }}</p>
        <p><strong>Location:</strong> {{ notification.location }}</p>
        <p><strong>Additional Info:</strong> {{ notification.additionalInfo }}</p>

        <!-- Only show actions if status is 'pending' -->
        <div v-if="notification.status === 'pending'" class="actions">
          <button @click="updateNotificationStatus(notification.id, 'accepted')">Accept</button>
          <button @click="updateNotificationStatus(notification.id, 'denied')">Deny</button>
        </div>
      </li>
    </ul>

    <div v-else class="no-notifications">No notifications at the moment.</div>
  </div>
</template>

<script>
import { db } from '@/firebase/init';
import { collection, query, onSnapshot, where, updateDoc, doc } from 'firebase/firestore';
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  props: {
    artisanId: String,  // Artisan ID passed as a prop
    // userId: String,     // Current User ID (Requester)
  },
  setup(props) {
    const notifications = ref([]);
    const filteredNotifications = ref([]);
    const loading = ref(true);
    const error = ref('');
    const currentView = ref('received'); // Can be 'issued' or 'received'

    // Fetch notifications from Firestore based on current view (issued/received)
    const fetchNotifications = () => {
      loading.value = true;
      error.value = '';

      const notificationsRef = collection(db, 'notify');
      let q;

      // Filter based on the current view
      if (currentView.value === 'received') {
        q = query(notificationsRef, where('ArtisanId', '==', props.artisanId)); // Received by artisan
      } else if (currentView.value === 'issued') {
        // console.log(props.userId);
        q = query(notificationsRef, where('userId', '==', props.artisanId)); // Issued by user
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        notifications.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        filteredNotifications.value = notifications.value; // Initially show all notifications for the selected view
        loading.value = false;
      }, (err) => {
        error.value = 'Error fetching notifications: ' + err.message;
        loading.value = false;
      });

      onUnmounted(() => {
        unsubscribe();
      });
    };

    // Update notification status
    const updateNotificationStatus = async (notificationId, status) => {
      try {
        const notificationDocRef = doc(db, 'notify', notificationId);
        await updateDoc(notificationDocRef, { status });
        alert(`Request has been ${status}.`);
      } catch (err) {
        error.value = 'Error updating status: ' + err.message;
      }
    };

    // Filter notifications by status
    const filterNotifications = (status) => {
      if (status === 'all') {
        filteredNotifications.value = notifications.value;
      } else {
        filteredNotifications.value = notifications.value.filter(notification => notification.status === status);
      }
    };

    // Toggle between "Issued" and "Received" notifications view
    const toggleNotificationView = (view) => {
      currentView.value = view;
      fetchNotifications();  // Re-fetch notifications when the view changes
    };

    onMounted(fetchNotifications);

    return {
      notifications,
      filteredNotifications,
      loading,
      error,
      updateNotificationStatus,
      filterNotifications,
      toggleNotificationView,
    };
  },
};
</script>

<style scoped>
.notifications-list {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  color: #333;
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

.filter-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.filter-buttons button,
.toggle-buttons button {
  padding: 8px 12px;
  margin-right: 10px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f0f0f0;
}

.filter-buttons button:hover,
.toggle-buttons button:hover {
  background-color: #e0e0e0;
}

.notification-list {
  list-style-type: none;
  padding: 0;
}

.notification-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fff;
}

.no-notifications {
  text-align: center;
  color: #666;
  font-style: italic;
}

.actions {
  margin-top: 10px;
}

.actions button {
  margin-right: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:first-of-type {
  background-color: #4caf50;
  color: white;
}

.actions button:last-of-type {
  background-color: #f44336;
  color: white;
}

.status-accepted {
  color: green;
  font-weight: bold;
}

.status-denied {
  color: red;
  font-weight: bold;
}

.toggle-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
</style>
