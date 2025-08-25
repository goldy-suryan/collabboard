## Task Management System (Microservices + Kafka + RBAC)

### Overview

This project is a **Task Management** System built using **Node.js, Express, MongoDB, Kafka, and Socket.IO**.

It follows a **microservices architecture** with the following features:

**Task Service**: Handles CRUD operations for tasks.

**Notification Service**: Sends real-time notifications to clients using Socket.IO.

**Email Service**: Sends emails when tasks are assigned.

**Role-Based Access Control (RBAC)**: Restricts update/delete operations based on user roles.

**Kafka for Event Streaming**: Ensures reliable communication between services.



---

### Features

1. Create, Read, Update, Delete (CRUD) tasks

2. Event-driven communication using Kafka

3. Real-time notifications to clients via Socket.IO

4. Email notifications when a task is assigned

5. RBAC (Role-Based Access Control) to protect sensitive operations

6. Scalable Microservices architecture