import { Column, Entity, ManyToOne } from 'typeorm'
import AbstractEntity from './absract.entity'
import Employee from './employee.entity'

@Entity()
class NotificationChannel extends AbstractEntity {
  @Column()
  employeeId: string

  @Column()
  notificationChannel: string

  @ManyToOne(() => Employee, (employee) => employee.notificationChannels)
  employee?: Employee
}

export default NotificationChannel
