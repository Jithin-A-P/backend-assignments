import { Repository } from "typeorm";
import Subscription from "../entity/subscription.entity";

class SubscriptionRepository {
  constructor(private subscriptionRepository: Repository<Subscription>) {}

  public createSubscription = (subscription: Subscription): Promise<Subscription> => {
    return this.subscriptionRepository.save(subscription);
  }

  public getActiveSubscription = (bookIsbn: string, requestedBy: number): Promise<Subscription> => {
    return this.subscriptionRepository.findOne({
        where: {
            bookISBN: bookIsbn,
            requestedBy: requestedBy,
            status: "active"
        }
    });
  }
}

export default SubscriptionRepository;
