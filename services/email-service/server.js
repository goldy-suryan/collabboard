const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const { Kafka } = require('kafkajs');

dotenv.config();

const port = process.env.port;
const app = express();

app.use(cors());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your@email.com',
    pass: process.env.APP_PASS,
  },
});

const kafka = new Kafka({
  clientId: 'email-service',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'email-group' });

(async () => {
  while (true) {
    try {
      await consumer.connect();
      await consumer.subscribe({
        topic: 'task_assigned',
        fromBeginning: false,
      });
      console.log('email consumer connected');

      await consumer.run({
        eachMessage: ({ topic, partition, message }) => {
          console.log(
            message.value.toString(),
            'message here in email service'
          );
          const mailOptions = {
            from: 'from@email.com',
            to: '', // You will get the userId in message and you can get the email of the user by
            // calling user-service axios.get('http://localhost:3002/user/userId)
            subject: 'Task Assigned',
            text: 'You have been assigned a task',
            html: '<p>YOu have been assigned a task (as html here)</p>',
          };
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              return console.log(err, 'Error while sending email to user');
            }
            console.log(info.response, 'mail sent successfully');
          });
        },
      });
      break;
    } catch (e) {
      console.log(e, 'Error here');
      console.log('kafka not ready yet, retrying in 5sec...');
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
})();

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err, 'error in email service');
    process.exit(1);
  }
  console.log(`Email server listening on port: ${port}`);
});
