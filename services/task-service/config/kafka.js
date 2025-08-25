const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'task-service',
  brokers: ['localhost:9094'],
});

const producer = kafka.producer();

const run = async () => {
  try {
    await producer.connect();
  } catch (e) {
    console.log(e, 'Error while running producer');
  }
};

module.exports = {
  runKafkaProducer: run,
  producer,
};
