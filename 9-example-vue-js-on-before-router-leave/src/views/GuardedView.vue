<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

const showModal = ref(false);

// Variable to store the `next` function
let navigationNext = null;

onBeforeRouteLeave((to, from, next) => {
  // Show the modal
  showModal.value = true;
  // Capture the `next` function to be called later
  navigationNext = next;
});

function confirmNavigation() {
  showModal.value = false;
  
  if (navigationNext) {
    navigationNext(true);
  }
  navigationNext = null; // Clean up
}

function cancelNavigation() {
  showModal.value = false;
  navigationNext = null; // Clean up
}

// A simple keydown listener for TV remote navigation within the modal
function handleKeydown(event) {
  if (!showModal.value) return;

  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    const focusable = Array.from(document.querySelectorAll('.modal-button'));
    const currentFocus = document.activeElement;
    const currentIndex = focusable.indexOf(currentFocus);
    const nextIndex = (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + focusable.length) % focusable.length;
    focusable[nextIndex].focus();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<!-- The <template> and <style> sections remain exactly the same -->
<template>
  <div>
    <h2>Guarded Page</h2>
    <p>Try to navigate away from this page by using the links above or the "Back" button.</p>
    <p>A confirmation modal should appear.</p>

    <!-- The Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content" role="dialog" aria-labelledby="modal-title">
        <h3 id="modal-title">Leave page</h3>
        <p>Would you like to live the page?</p>
        <div class="modal-actions">
          <!-- The first button gets auto-focused -->
          <button @click="cancelNavigation" class="modal-button cancel" autofocus>Cancel</button>
          <button @click="confirmNavigation" class="modal-button confirm">Leave</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles ensure they only apply to this component */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #34495e;
  padding: 40px;
  border-radius: 10px;
  border: 2px solid #1abc9c;
  width: 80%;
  max-width: 600px;
  text-align: center;
}

.modal-content h3 {
  font-size: 2rem;
  color: #ecf0f1;
  margin-top: 0;
}

.modal-content p {
  font-size: 1.2rem;
  color: #bdc3c7;
}

.modal-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.modal-button {
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: bold;
  border: 2px solid transparent;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.modal-button.cancel {
  background-color: #3498db;
  color: white;
}

.modal-button.confirm {
  background-color: #c0392b;
  color: white;
}

.modal-button:focus {
  outline: none;
  border-color: #f1c40f;
  transform: scale(1.05);
}
</style>

