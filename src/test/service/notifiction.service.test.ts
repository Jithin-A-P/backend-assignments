import { DataSource } from "typeorm";
import { when } from "jest-when";
import { plainToInstance } from "class-transformer";
import EditDepartmentDto from "../../dto/edit-department.dto";
import NotificationRepository from "../../repository/notification.repository";
import NotificationService from "../../service/notification.service";
import Notification from "../../entity/notification.entity";
import NotificationType from "../../utils/notification-type.enum";
import NotificationStatus from "../../utils/notification-status.enum";

describe("Notification Service Tests", () => {
  let notificationService: NotificationService;
  let notificationRepository: NotificationRepository;

  beforeAll(() => {
    const dataSource: DataSource = {
      getRepository: jest.fn(),
    } as unknown as DataSource;

    notificationRepository = new NotificationRepository(
      dataSource.getRepository(Notification)
    );
    notificationService = new NotificationService(notificationRepository);
  });

  describe("Test for getNotification", () => {
    test("Success case", async () => {
      const mockUnread = jest.fn();
      when(mockUnread).calledWith("1").mockResolvedValueOnce({
        employeeId: "1",
        status: "unread",
        type: "Overdue",
        content: "Content",
      });
      notificationRepository.findUnread = mockUnread;

      const notification = await notificationService.getNotification("1");
      expect(notification).toStrictEqual({
        employeeId: "1",
        status: "unread",
        type: "Overdue",
        content: "Content",
      });
    });

    test("Failure case", async () => {
      const mockUnread = jest.fn();
      when(mockUnread).calledWith("1").mockResolvedValueOnce(null);
      notificationRepository.findUnread = mockUnread;
      expect(
        async () => await notificationService.getNotification("1")
      ).rejects.toThrowError();
    });
  });

  describe("Test for addNotification", () => {
    test("Success case", async () => {
      const mockAddNotification = jest.fn();
      mockAddNotification.mockResolvedValueOnce({
        employeeId: "1",
        status: "unread",
        type: "overdue",
        content: "Content",
      });
      notificationRepository.addNotification = mockAddNotification;

      const notification = await notificationService.addNotification({
        employeeId: "1",
        status: NotificationStatus.UNREAD,
        type: NotificationType.OVERDUE,
        content: "Content",
      });
      expect(notification).toStrictEqual({
        employeeId: "1",
        status: "unread",
        type: "overdue",
        content: "Content",
      });
    });
  });

  describe("Test for addNotifications", () => {
    test("Success case", async () => {
      const mockAddNotification = jest.fn();
      mockAddNotification.mockResolvedValueOnce([
        {
          employeeId: "1",
          status: NotificationStatus.UNREAD,
          type: NotificationType.OVERDUE,
          content: "Content",
        },
        {
          employeeId: "2",
          status: NotificationStatus.UNREAD,
          type: NotificationType.OVERDUE,
          content: "Content",
        },
      ]);
      notificationRepository.addNotifications = mockAddNotification;

      const notification = await notificationService.addNotifications([
        {
          employeeId: "1",
          status: NotificationStatus.UNREAD,
          type: NotificationType.OVERDUE,
          content: "Content",
        },
        {
          employeeId: "2",
          status: NotificationStatus.UNREAD,
          type: NotificationType.OVERDUE,
          content: "Content",
        },
      ]);
      expect(notification).toStrictEqual([
        {
          employeeId: "1",
          status: NotificationStatus.UNREAD,
          type: NotificationType.OVERDUE,
          content: "Content",
        },
        {
          employeeId: "2",
          status: NotificationStatus.UNREAD,
          type: NotificationType.OVERDUE,
          content: "Content",
        },
      ]);
    });
  });

  describe("Test for editNotification", () => {
    test("Success case", async () => {
      const mockUpdateNotification = jest.fn();
      const mockFindById = jest.fn();
      mockUpdateNotification.mockResolvedValueOnce({
        employeeId: "1",
        status: NotificationStatus.READ,
        type: NotificationType.OVERDUE,
        content: "Content",
      });
      when(mockFindById).calledWith("1").mockResolvedValueOnce({
        employeeId: "1",
        status: NotificationStatus.UNREAD,
        type: NotificationType.OVERDUE,
        content: "Content",
      });
      notificationRepository.findById = mockFindById;
      notificationRepository.updateNotification= mockUpdateNotification;

      const notification = await notificationService.editNotification("1", {
        status: NotificationStatus.UNREAD,
      });
      expect(notification).toStrictEqual({
        employeeId: "1",
        status: NotificationStatus.READ,
        type: NotificationType.OVERDUE,
        content: "Content",
      });
    });

    test("Failure case", async () => {
        const mockUpdateNotification = jest.fn();
        const mockFindById = jest.fn();
        mockUpdateNotification.mockResolvedValueOnce({
          employeeId: "1",
          status: NotificationStatus.READ,
          type: NotificationType.OVERDUE,
          content: "Content",
        });
        when(mockFindById).calledWith("1").mockResolvedValueOnce(null);
        notificationRepository.findById = mockFindById;
        notificationRepository.updateNotification= mockUpdateNotification;
  
        // const notification = await notificationService.editNotification("1", {
        //   status: NotificationStatus.UNREAD,
        // });
        // expect(notification).toStrictEqual({
        //   employeeId: "1",
        //   status: NotificationStatus.READ,
        //   type: NotificationType.OVERDUE,
        //   content: "Content",
        // });
        expect(
            async () => await notificationService.editNotification("1", {
                status: NotificationStatus.UNREAD,
              })
          ).rejects.toThrowError();
        
      });
  });

  //   describe('Test for getDepartmentById', () => {
  //     test('Success case', async () => {
  //       const mockFindById = jest.fn()
  //       const mockDpt = { id: 'a', name: 'dept' }
  //       when(mockFindById).calledWith('a').mockResolvedValueOnce(mockDpt)
  //       departmentRepository.findById = mockFindById

  //       const department = await departmentService.getDepartmentById('a')
  //       expect(department).toStrictEqual(mockDpt)
  //     })

  //     test('Failure case', async () => {
  //       const mockFindById = jest.fn()
  //       when(mockFindById).calledWith(2).mockResolvedValueOnce(null)
  //       departmentRepository.findById = mockFindById

  //       expect(
  //         async () => await departmentService.getDepartmentById('a')
  //       ).rejects.toThrowError()
  //     })
  //   })

  //   describe('Test for addDepartment', () => {
  //     test('Success case', async () => {
  //       const mockAdd = jest.fn()
  //       mockAdd.mockResolvedValueOnce({ id: 'a' })
  //       departmentRepository.add = mockAdd
  //       const departmentDto = plainToInstance(DepartmentDto, {
  //         id: 'a',
  //         name: 'dept',
  //       })
  //       const department = await departmentService.addDepartment(
  //         departmentDto as Department
  //       )

  //       expect(department).toStrictEqual({ id: 'a' })
  //     })
  //   })

  //   describe('Tests for updateDepartment', () => {
  //     test('Success case', async () => {
  //       const mockFindById = jest.fn()
  //       when(mockFindById).calledWith('a').mockResolvedValue(new Department())
  //       departmentRepository.findById = mockFindById

  //       const mockUpdate = jest.fn()
  //       mockUpdate.mockImplementation((dept) => {})
  //       departmentRepository.update = mockUpdate

  //       const updateDepartmentDto = plainToInstance(DepartmentDto, {
  //         id: 'a',
  //         name: 'DEPT',
  //       })

  //       expect(
  //         async () =>
  //           await departmentService.updateDepartment(
  //             'a',
  //             updateDepartmentDto as Department
  //           )
  //       ).not.toThrowError()
  //     })

  //     test('Failure case', async () => {
  //       const mockFindById = jest.fn()
  //       when(mockFindById).calledWith('a').mockResolvedValue(null)
  //       departmentRepository.findById = mockFindById

  //       const mockUpdate = jest.fn()
  //       mockUpdate.mockImplementation((dept) => {})
  //       departmentRepository.update = mockUpdate

  //       const updateDepartmentDto = plainToInstance(DepartmentDto, {
  //         id: 'a',
  //         name: 'DEPT',
  //       })

  //       expect(
  //         async () =>
  //           await departmentService.updateDepartment(
  //             'a',
  //             updateDepartmentDto as Department
  //           )
  //       ).rejects.toThrowError()
  //     })
  //   })

  //   describe('Tests for editDepartment', () => {
  //     test('Success case', async () => {
  //       const mockFindById = jest.fn()
  //       when(mockFindById).calledWith('a').mockResolvedValue({
  //         id: 'a',
  //         name: 'Name'
  //       })
  //       departmentRepository.findById = mockFindById

  //       const mockUpdate = jest.fn()
  //       mockUpdate.mockImplementation((dept) => {})
  //       departmentRepository.update = mockUpdate

  //       const editDepartmentDto = plainToInstance(EditDepartmentDto, {
  //         name: 'Dept',
  //       })

  //       expect(
  //         async () =>
  //           await departmentService.editDepartment(
  //             'a',
  //             editDepartmentDto
  //           )
  //       ).not.toThrowError()
  //     })

  //     test('Failure case', async () => {
  //       const mockFindById = jest.fn()
  //       when(mockFindById).calledWith('a').mockResolvedValue({
  //         id: 'a',
  //         name: 'Name'
  //       })
  //       departmentRepository.findById = mockFindById

  //       const mockUpdate = jest.fn()
  //       mockUpdate.mockImplementation((dept) => {})
  //       departmentRepository.update = mockUpdate

  //       const editDepartmentDto = plainToInstance(EditDepartmentDto, {
  //         name1: 'Dept',
  //       })

  //       expect(
  //         async () =>
  //           await departmentService.editDepartment(
  //             'a',
  //             editDepartmentDto
  //           )
  //       ).rejects.toThrowError()
  //     })

  //     test('Failure case null returned', async () => {
  //       const mockFindById = jest.fn()
  //       when(mockFindById).calledWith('a').mockResolvedValue(null)
  //       departmentRepository.findById = mockFindById

  //       const mockUpdate = jest.fn()
  //       mockUpdate.mockImplementation((dept) => {})
  //       departmentRepository.update = mockUpdate

  //       const editDepartmentDto = plainToInstance(EditDepartmentDto, {
  //         name: 'Dept',
  //       })

  //       expect(
  //         async () =>
  //           await departmentService.editDepartment(
  //             'a',
  //             editDepartmentDto
  //           )
  //       ).rejects.toThrowError()
  //     })
  //   })
});
