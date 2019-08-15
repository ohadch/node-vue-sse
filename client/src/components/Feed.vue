<template>
  <div>
    <h1>Messages</h1>
    <ul>
      <li v-for="message in sortedMessages" :key="message.id">{{ message.id }}. {{ message.text }}</li>
    </ul>
  </div>
</template>
 
<script>
// We store the reference to the SSE object out here
// so we can access it from other methods
let msgServer;

export default {
  name: "Feed",
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

        // Listen for messages based on their event (in this case, "chat")
        sse.subscribe("message", message => {
          // Make sure message does not exist
          if (this.messages.find(m => m.id === message.id)) {
            this.messages = this.messages.filter(m => m.id !== message.id)
          }
          this.messages.push(message)
        });

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
  },
  computed: {
    sortedMessages() {
      let messages = this.messages;
      return messages.sort((a, b) => a.id > b.id ? -1 : 1)
    }
  }
};
</script> 