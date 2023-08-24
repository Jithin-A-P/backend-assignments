import { Repository } from "typeorm"
import CronJob from "../entity/cron-job.entity"

class CronJobRepository {
  constructor(private cronJobRepository: Repository<CronJob>) {}

  public add = (cronJob: CronJob): Promise<CronJob> => {
    return this.cronJobRepository.save(cronJob)
  }

  public getAll = (): Promise<CronJob[]> => {
    return this.cronJobRepository.find({
      relations: {
        borrowedBook: {
          book: true,
        }
      }
    })
  }

  public getOne = (employeeId: string, borrowedBookId: string): Promise<CronJob> => {
    return this.cronJobRepository.findOne({
      where: {
        employeeId: employeeId,
        borrowedBookId: borrowedBookId
      }
    })
  }

  public remove = (cronJob: CronJob): Promise<CronJob> => {
    return this.cronJobRepository.remove(cronJob)
  }
}

export default CronJobRepository