import { Column, Entity } from 'typeorm'
import AbstractEntity from './absract.entity'

@Entity()
class BookShelfJn extends AbstractEntity {
  @Column()
  shelfCode: string

  @Column()
  bookIsbn: string

  @Column()
  bookCount: number
}

export default BookShelfJn
