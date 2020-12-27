import Store from '../store'
import Show from './show'
import Basic from './basic'
import Coupon from './coupon'
import Order from './order'
import TicketCheck from './ticket-checkor'
import Users from './users'
import Operation from './operation'
import Sponsor from './sponsor'
import Oganizer from './organizer'
import sort from './sort'
import activity from './activity'

export const routes = [
  Order,
  Show,
  sort,
  Operation,
  Coupon,
  Users,
  Sponsor,
  Oganizer,
  TicketCheck,
  Basic,
  activity
]

export default {
  path: '/',
  component: () => import('@views/layout'),
  children: [
    ...routes
  ]
}
