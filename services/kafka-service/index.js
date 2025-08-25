const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'kafka-service',
  brokers: ['localhost:9094'],
});

const admin = kafka.admin();

(async () => {
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
  } catch (e) {
    console.log(e, 'Error', e?.message);
  } finally {
    await admin.disconnect();
  }
})();
