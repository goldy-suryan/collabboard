const { Kafka } = require('kafkajs');

console.log('Broker is', process.env.BROKER);

const kafka = new Kafka({
  clientId: 'task-service',
  brokers: [process.env.BROKER],
});

const producer = kafka.producer();

const run = async () => {
  while (true) {
    try {
      await producer.connect();
      console.log('producer connected');
      break;
    } catch (e) {
      console.log(e, 'Error while running producer');
      console.error("Kafka not ready yet, retrying in 5s...");
      await new Promise(r => setTimeout(r, 5000));
    }
  }
};

module.exports = {
  runKafkaProducer: run,
  producer,
};
