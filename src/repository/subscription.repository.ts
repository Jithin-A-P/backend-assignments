import { Repository } from 'typeorm'
import Subscription from '../entity/subscription.entity'
import SubscriptionStatus from '../utils/subscription-status.enum'

class SubscriptionRepository {
  constructor(private subscriptionRepository: Repository<Subscription>) {}

  public addSubscription = (
    subscription: Subscription
  ): Promise<Subscription> => {
    return this.subscriptionRepository.save(subscription)
  }

  public updateSubscriptions = (
    subscriptions: Subscription[]
  ): Promise<Subscription[]> => {
    return this.subscriptionRepository.save(subscriptions)
  }

  public getActiveSubscriptions = (
    bookIsbn: string,
    requestedBy: string
  ): Promise<Subscription[]> => {
    return this.subscriptionRepository.find({
      where: {
        bookISBN: bookIsbn,
        requestedBy: requestedBy,
        status: SubscriptionStatus.ACTIVE,
      },
    })
  }
}

export default SubscriptionRepository
