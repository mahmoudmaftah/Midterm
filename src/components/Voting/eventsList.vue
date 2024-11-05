<template>
    <h2>Upcoming Events</h2>
    <div class="event-list">
      
      <div v-for="event in events" :key="event.id" class="event-item">
        <img :src="event.imgurl" alt="event image" class="event-image" />
        <div class="event-details">
          <h3 class="event-title">{{ event.title }}</h3>
          <p class="event-description">{{ event.description }}</p>
          <p class="event-date"><strong>Date:</strong> {{ event.date }}</p>
            <p class="event-date"><strong>Free Event:</strong> {{ event.isfree ? 'Yes' : 'No' }}</p>
            <p class="event-date"><strong>Price:</strong> {{ event.price }}</p>
            <p class="event-date"><strong>Yes Votes:</strong> {{ event.yesVotesCount }}</p>
            <p class="event-date"><strong>No Votes:</strong> {{ event.noVotesCount }}</p>
  
          <div v-if="userVote && userVote.eventId === event.id" class="user-vote">
            <p><strong>Your Vote:</strong> {{ userVote.vote === 'yes' ? 'Yes' : 'No' }}</p>
          </div>
  




          <div v-else class="vote-buttons">
            <button @click="vote(event.id, 'yes')" :disabled="votedForEvent(event.id)" class="vote-btn yes-btn">
              Vote Yes
            </button>
            <button @click="vote(event.id, 'no')" :disabled="votedForEvent(event.id)" class="vote-btn no-btn">
              Vote No
            </button>
          </div>
  
          <!-- Notification if the user already voted -->
          <p v-if="votedForEvent(event.id)" class="voted-notice">You've already voted on this event.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { auth, db } from '@/firebase/init';
  import { collection, getDocs, query, where, addDoc, updateDoc, doc, increment } from 'firebase/firestore';
  
  export default {
    data() {
      return {
        events: [],
        userVote: null,
      };
    },
    async created() {
      await this.fetchEvents();
      await this.fetchUserVote();
    },
    methods: {
      async fetchEvents() {
        const eventRef = collection(db, 'events');
        const eventSnapshot = await getDocs(eventRef);
        this.events = eventSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
      },
  
      async fetchUserVote() {
        const user = auth.currentUser;
        if (!user) {
          alert('Please log in to vote');
          return;
        }
  
        const voteRef = collection(db, 'votes');
        const voteQuery = query(voteRef, where('userId', '==', user.uid));
        const voteSnapshot = await getDocs(voteQuery);
  
        if (!voteSnapshot.empty) {
          this.userVote = voteSnapshot.docs[0].data();
        }
      },
  
      async vote(eventId, voteValue) {
        const user = auth.currentUser;
        if (!user) {
          alert('Please log in to vote');
          return;
        }
  
        const voteRef = collection(db, 'votes');
        const voteQuery = query(
          voteRef,
          where('eventId', '==', eventId),
          where('userId', '==', user.uid)
        );
  
        const existingVote = await getDocs(voteQuery);
  
        // Handle existing vote
        if (!existingVote.empty) {
          const voteDoc = existingVote.docs[0];
          await updateDoc(voteDoc.ref, { vote: voteValue });
        } else {
          await addDoc(voteRef, {
            eventId,
            userId: user.uid,
            vote: voteValue,
          });
        }
  
        // Update the event vote counts in Firestore
        const eventDocRef = doc(db, 'events', eventId);
        if (voteValue === 'yes') {
          await updateDoc(eventDocRef, {
            yesVotesCount: increment(1),
          });
        } else {
          await updateDoc(eventDocRef, {
            noVotesCount: increment(1),
          });
        }
  
        // Refresh the user vote and event data
        await this.fetchUserVote();
        await this.fetchEvents();
      },
  
      votedForEvent(eventId) {
        return this.userVote && this.userVote.eventId === eventId;
      },
    },
  };
  </script>
  
  
  <style scoped>
  /* Event List Styling */
  .event-list {
    display: flex;
    width: 800px;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: space-around;
    margin-top: 20px;
    border: 1px solid #ddd;
  }
  
  h2 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 40px;
    color: #333;
  }
  
  /* Event Item Styling */
  .event-item {
    width: 300px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .event-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
  
  .event-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 15px;
  }
  
  /* Event Details */
  .event-details {
    text-align: left;
  }
  
  .event-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 10px;
    color: #333;
  }
  
  .event-description {
    font-size: 1rem;
    color: #555;
    margin-bottom: 15px;
  }
  
  .event-date {
    font-size: 1rem;
    color: #777;
    margin-bottom: 15px;
  }
  
  /* Vote Buttons Styling */
  .vote-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  
  .vote-btn {
    padding: 10px 20px;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .vote-btn:hover {
    opacity: 0.8;
  }
  
  .yes-btn {
    background-color: #28a745;
    color: white;
  }
  
  .no-btn {
    background-color: #dc3545;
    color: white;
  }
  
  .vote-btn:disabled {
    background-color: #dcdcdc;
    cursor: not-allowed;
  }
  
  .user-vote {
    font-size: 1rem;
    margin-top: 10px;
    color: #444;
  }
  
  .voted-notice {
    font-size: 1rem;
    color: #ff6600;
    margin-top: 10px;
  }
  </style>
  