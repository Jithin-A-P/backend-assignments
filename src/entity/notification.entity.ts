import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import AbstractEntity from './absract.entity'
import Employee from './employee.entity'
import NotificationStatus from '../utils/notification-status.enum'
import NotificationType from '../utils/notification-type.enum'

@Entity()
class Notification extends AbstractEntity {
  @Column()
  employeeId: number

  @Column()
  status: NotificationStatus

  @Column()
  type: NotificationType

  @Column()
  content: string

  @ManyToOne(() => Employee, (employee) => employee.notifications)
  @JoinColumn({
    name: 'employee_id',
    referencedColumnName: 'id'
  })
  employee?: Employee
}

export default Notification;
