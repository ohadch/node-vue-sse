<template>
  <div>
    <h1>Messages</h1>
    <ul>
      <li v-for="message in messages" :key="message.id">{{ message }}</li>
    </ul>
  </div>
</template>
 
<script>
// We store the reference to the SSE object out here
// so we can access it from other methods
let msgServer;

export default {
  name: "sse-test",
  data() {
    return {
      messages: []
    };
  },
  mounted() {
    this.$sse("/stream", { format: "json" }) // or { format: 'plain' }
      .then(sse => {
        // Store SSE object at a higher scope
        msgServer = sse;

        // Catch any errors (ie. lost connections, etc.)
        sse.onError(e => {
          console.error("lost connection; giving up!", e);

          // This is purely for example; EventSource will automatically
          // attempt to reconnect indefinitely, with no action needed
          // on your part to resubscribe to events once (if) reconnected
          sse.close();
        });

        // Listen for messages without a specified event
        sse.subscribe("", data => {
          console.warn("Received a message w/o an event!", data);
        });

        // Listen for messages based on their event (in this case, "chat")
        sse.subscribe("chat", message => {
          this.messages.push(message);
        });

        // Unsubscribes from event-less messages after 7 seconds
        setTimeout(() => {
          sse.unsubscribe("");

          console.log("Stopped listening to event-less messages!");
        }, 7000);

        // Unsubscribes from chat messages after 7 seconds
        setTimeout(() => {
          sse.unsubscribe("chat");

          console.log("Stopped listening to chat messages!");
        }, 14000);
      })
      .catch(err => {
        // When this error is caught, it means the initial connection to the
        // events server failed.  No automatic attempts to reconnect will be made.
        console.error("Failed to connect to server", err);
      });
  },
  beforeDestroy() {
    // Make sure to close the connection with the events server
    // when the component is destroyed, or we'll have ghost connections!
    msgServer.close();
  }
};
</script> 