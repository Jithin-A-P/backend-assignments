import { Column, Entity } from 'typeorm'
import AbstractEntity from './absract.entity'

@Entity()
class BookShelfJn extends AbstractEntity {
  @Column()
  bookCount: number

  // @Column()
  // shelfCode: string

  // @Column()
  // bookIsbn: string
}

export default BookShelfJn
