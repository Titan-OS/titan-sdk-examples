<script setup>
// RouterLink is the component for creating navigation links.
// RouterView is the component that displays the content of the current route.
import { RouterLink, RouterView, useRouter } from 'vue-router'

// Get the router instance to programmatically control navigation
const router = useRouter()

function goBack(e) {
  console.log(window.history.length)
  e.preventDefault();
  // This function uses the vue-router instance to navigate back.
  // It's generally better to use this method within a Vue app
  // to keep navigation consistent with the router's state.
  router.back();
}
</script>

<template>
  <div id="app-container">
    <header>
      <h1>Vue Router TV Test</h1>
      <nav>
        <!--
          These are the navigation buttons.
          <RouterLink> is the Vue Router way to create links.
          The 'to' prop specifies the destination path.
        -->
        <RouterLink to="/" class="nav-button">Go to Home</RouterLink>
        <RouterLink to="/about" class="nav-button">Go to About</RouterLink>

        <!-- This is the link to the guarded page for testing the bug report -->
        <RouterLink to="/guarded" class="nav-button">Go to Guarded Page</RouterLink>
        
        <!--
          This is a standard button that calls our goBack method when clicked.
          It uses the same styling for a consistent look.
        -->
        <button @click="goBack" class="nav-button back-button">Back</button>
      </nav>
    </header>

    <main>
      <!--
        This is where the component for the current route will be rendered.
        When you click "Go to Home", HomeView.vue will appear here.
        When you click "Go to About", AboutView.vue will appear here.
      -->
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Base styles for the entire application */
body {
  background-color: #2c3e50;
  color: #ecf0f1;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 0;
  padding: 0;
}

#app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

header {
  margin-bottom: 40px;
}

h1 {
  font-size: 3rem;
  color: #e67e22;
}

nav {
  display: flex;
  gap: 20px; /* Space between the buttons */
  justify-content: center;
  flex-wrap: wrap;
}

/* Base style for navigation links and buttons */
.nav-button {
  display: inline-block;
  padding: 15px 30px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: bold;
  border: 2px solid transparent;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

/* Style for when the button is active/focused, important for TV navigation */
.nav-button:focus,
.nav-button:hover {
  background-color: #2980b9;
  border-color: #ecf0f1;
  outline: none; /* Removes the default browser focus outline */
}

/* Style for the "Back" button to make it visually distinct */
.back-button {
  background-color: #c0392b;
}

.back-button:focus,
.back-button:hover {
  background-color: #e74c3c;
}

main {
  border: 2px solid #3498db;
  padding: 40px;
  border-radius: 10px;
  width: 80%;
  max-width: 900px;
  min-height: 300px;
}

main h2 {
  font-size: 2.5rem;
  color: #e67e22;
}

main p {
  font-size: 1.5rem;
}
</style>

