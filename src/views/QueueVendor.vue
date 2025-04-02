<template>
  <div class="main">
  <h1>Queue</h1>
  <div class="container">
    <div class="queuebox">C011</div>
  </div>
  <div class="bt-align">
    <button class="process-btn">Close</button>
    <button class="process-btn">Start</button>
    <button class="process-btn">Next</button>
    <button style="background-color: #b57a65" class="process-btn">Cancel</button>
  </div>
  <div>
    <div class="nextup">
      <h2>Next up</h2>
    </div>

    <span class="queue">C012</span>
    <span class="queue">C013</span>
    <span class="queue">C014</span>
  </div></div>
</template>

<script setup></script>
<style lang="css">

.main{
  padding: 20px;
}
h1 {
  font-weight: 500;
}
hr {
  background-color: #dcdcdc;
}
.queuebox {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 128px;
  
}
.nextup {
  margin: 2.5rem 0 2.5rem 0;
  padding-bottom: 1rem;
  border-bottom: #dcdcdc 1px solid;
}
.queue {
  font-size: 48px;
  font-weight: 500;
  padding: 2rem;
  margin: 1rem;
  border: #dcdcdc 1px solid;
  border-radius: 15px;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 40vh;
  margin: 0rem 10rem 0 10rem;
  border-radius: 15px;
  background-color: #ffffff;
}
.process-btn {
  margin: 0 3.3rem 0 0;
  padding: 2rem 4rem;
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: medium;
}
.bt-align {
  margin: 1rem 10rem 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
