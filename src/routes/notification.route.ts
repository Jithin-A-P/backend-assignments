import NotificationController from "../controller/notification.controller";
import dataSource from "../db/postgres.db";
import Notification from "../entity/notification.entity";
import NotificationRepository from "../repository/notification.repository";
import NotificationService from "../service/notification.service";

const notificationRepository = new NotificationRepository(
    dataSource.getRepository(Notification)
);
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);
const notificationRoute = notificationController.router;

export default notificationRoute;