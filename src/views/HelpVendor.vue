<template>
  <div>
    <div class="ask-container">
      <h1>Help Centre</h1>
      <h3>Need Assistance? We've got you covered!</h3>
      <div
        style="
          display: flex;
          flex-direction: row;
          gap: 1rem;
          padding: 1rem;
          align-items: center;
        "
      >
        <InputText
          v-model="value2"
          type="text"
          placeholder="Ask a question.."
        />
        <Button label="Send" class="send-btn" />
      </div>
    </div>
    <div class="asked-questions">
        <!-- สีพังเดี๋ยวกลับมาแก้ -->
      <h2>Frequently Asked Questions</h2>
      <div class="accordion-container">
        <Accordion value="0">
          <AccordionPanel value="0">
            <AccordionHeader>How do I reset my password?</AccordionHeader>
            <AccordionContent>
              <p class="m-0">
                To reset your password, go to the login page and click on
                "Forgot Password". Follow the instructions sent to your email.
              </p>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="1">
            <AccordionHeader>How do I contact support?</AccordionHeader>
            <AccordionContent>
              <p class="m-0">
                You can contact support by clicking on the "Contact Us" link at
                the bottom of the page.
              </p>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="2">
            <AccordionHeader>How do I update my profile?</AccordionHeader>
            <AccordionContent>
              <p class="m-0">
                You can update your profile by going to the "Profile" section in
                your account settings.
              </p>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
const value2 = ref('');
</script>
<style lang="css">
.main {
  padding: 20px;
}
h1,
h3 {
  font-weight: 500;
}
.ask-container {
  display: flex;
  flex-direction: column;
  background: rgb(249, 250, 251);
  background: linear-gradient(
    0deg,
    rgba(249, 250, 251, 1) 9%,
    rgba(164, 195, 178, 1) 66%
  );
  align-items: center;
  justify-content: center;
  height: 300px;
}
.send-btn {
  text-align: center;
  display: flex;
  align-items: center;
  width: 100px;
  height: 40px;
}
.asked-questions {
  padding: 20px;
}
.accordion-container {
  margin: 2rem 0 2rem 0;
  padding-bottom: 1rem;
}
</style>
