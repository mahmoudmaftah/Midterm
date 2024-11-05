<template>
    <div class="event-form">
      <h2>Add Event</h2>
      <form @submit.prevent="submitEvent">
        <div>
          <label for="imgurl">Image URL</label>
          <input type="text" id="imgurl" v-model="event.imgurl" required />
        </div>
  
        <div>
          <label for="title">Event Title</label>
          <input type="text" id="title" v-model="event.title" required />
        </div>
  
        <div>
          <label for="description">Description</label>
          <textarea id="description" v-model="event.description" required></textarea>
        </div>
  
        <div>
          <label for="date">Event Date</label>
          <input type="date" id="date" v-model="event.date" required />
        </div>
  
        <div>
          <label for="isfree">Is it free?</label>
          <input type="checkbox" id="isfree" v-model="event.isfree" />
        </div>
  
        <div v-if="!event.isfree">
          <label for="price">Price</label>
          <input type="number" id="price" v-model="event.price" />
        </div>
  
        <div>
          <button type="submit">Add Event</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { auth, db } from "@/firebase/init"; // Import Firebase Firestore from the new modular SDK
  import { collection, addDoc } from "firebase/firestore"; // Import necessary methods
  
  export default {
    data() {
      return {
        event: {
          imgurl: '',
          title: '',
          description: '',
          date: '',
          isfree: false,
          price: null,
          yesVotesCount: 0,
          noVotesCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      };
    },
    methods: {
      async submitEvent() {
        try {
          // Add the event to Firestore collection using the new modular SDK methods
          const eventRef = collection(db, 'events'); // Get reference to 'events' collection
          await addDoc(eventRef, {
            imgurl: this.event.imgurl,
            title: this.event.title,
            description: this.event.description,
            date: this.event.date,
            isfree: this.event.isfree,
            price: this.event.isfree ? null : this.event.price, // Set price to null if it's free
            yesVotesCount: this.event.yesVotesCount,
            noVotesCount: this.event.noVotesCount,
            createdAt: this.event.createdAt,
            updatedAt: this.event.updatedAt
          });
  
          // Reset the form after successful submission
          this.resetForm();
          alert("Event added successfully!");
        } catch (error) {
          console.error("Error adding event:", error);
          alert("There was an error adding the event.");
        }
      },
      resetForm() {
        this.event = {
          imgurl: '',
          title: '',
          description: '',
          date: '',
          isfree: false,
          price: null,
          yesVotesCount: 0,
          noVotesCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }
  };
  </script>
  
  <style scoped>
  .event-form {
    width: 700px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .event-form label {
    display: block;
    margin-top: 10px;
  }
  
  .event-form input,
  .event-form textarea {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .event-form button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
  }
  
  .event-form button:hover {
    background-color: #0056b3;
  }
  </style>
  