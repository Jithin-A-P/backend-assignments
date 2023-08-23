import { Column, Entity, OneToMany } from 'typeorm'
import AbstractEntity from './absract.entity'
import BookShelfJn from './book-shelf-jn.entity'
import BorrowedBook from './borrowed-book.entity'
import Notification from './notification.entity'
import Subscription from './subscription.entity'

@Entity()
class Book extends AbstractEntity {
  @Column({ unique: true })
  isbn: string

  @Column()
  title: string

  @Column()
  author: string

  @Column()
  category: string

  @Column({ nullable: true })
  description?: string

  @Column({ nullable: true })
  publisher?: string

  @Column({ nullable: true })
  releaseDate?: string

  @Column({ nullable: true })
  thumbnailUrl?: string

  @Column()
  totalCount: number

  @Column()
  availableCount: number

  @OneToMany(() => Notification, (notification) => notification.book)
  notifications?: Notification[]

  @OneToMany(() => BookShelfJn, (bookShelfJn) => bookShelfJn.book)
  bookShelfJns?: BookShelfJn[]

  @OneToMany(() => BorrowedBook, (borrowedBook) => borrowedBook.book)
  borrowedBooks?: BorrowedBook[]

  @OneToMany(() => Subscription, (subscription) => subscription.subscribeTo)
  subscriptions?: Subscription[]

  shelves?: any[]
}

export default Book
