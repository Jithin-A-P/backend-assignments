import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import AbstractEntity from "./absract.entity";
import Employee from "./employee.entity";
import Book from "./book.entity";

@Entity()
class Subscription extends AbstractEntity {
  @Column()
  requestedBy: number;

  @Column({ nullable: true })
  requestedTo?: number;

  @Column()
  bookISBN: string;

  @Column()
  status: string;

  @ManyToOne(() => Employee, (employee) => employee.requestByUser)
  @JoinColumn({
    name: "requested_by",
    referencedColumnName: "id",
  })
  requestFrom?: Employee[];

  @ManyToOne(() => Employee, (employee) => employee.requestToUser)
  @JoinColumn({
    name: "requested_to",
    referencedColumnName: "id",
  })
  requestTo?: Employee[];

  @ManyToOne(() => Book, (book) => book.subscriptions)
  @JoinColumn({
    name: "book_isbn",
    referencedColumnName: "isbn",
  })
  subscribeTo?: Book[];
}

export default Subscription;
