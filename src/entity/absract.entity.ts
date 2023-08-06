import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm'

class AbstractEntity {
    @PrimaryGeneratedColumn()
    id: number
 
    @CreateDateColumn()
    createdAt: Date
  
    @UpdateDateColumn()
    updatedAt: Date
  
    @DeleteDateColumn()
    deletedAt: Date
}
  
export default AbstractEntity
  