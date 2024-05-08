<template>
    <div class="counter">
      <h2 class="counter-title">Counter</h2>
      <div class="counter-controls">
        <button class="counter-button" @click="decrement">-</button>
        <span class="counter-value">{{ count }}</span>
        <button class="counter-button" @click="increment">+</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Counter',
    data() {
      return {
        count: 0
      };
    },
    methods: {
      increment() {
        this.count++;
      },
      decrement() {
        if (this.count > 0) {
          this.count--;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .counter {
    max-width: 300px;
    margin: 40px auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    text-align: center;
  }
  
  .counter-title {
    color: #333;
  }
  
  .counter-controls {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 20px;
  }
  
  .counter-button {
    padding: 10px 20px;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
  
  .counter-button:hover {
    background-color: #0056b3;
  }
  
  .counter-value {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  </style>
  