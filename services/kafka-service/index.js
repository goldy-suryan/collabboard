const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'kafka-service',
  brokers: ['kafka:9092'],
});

const admin = kafka.admin();

(async () => {
  while (true) {
    try {
      await admin.connect();
      await admin.createTopics({
        topics: [
          {
            topic: 'task_created',
          },
          {
            topic: 'task_deleted',
          },
          {
            topic: 'task_udpated',
          },
          {
            topic: 'task_assigned',
          },
        ],
      });
      console.log('kafka service connected, generated topics')
      break;
    } catch (e) {
      console.log(e, 'Error', e?.message);
      console.log('kafka not ready yet, retrying in 5s...');
      await new Promise(r => setTimeout(r, 5000));
    } finally {
      await admin.disconnect();
    }
  }
})();
