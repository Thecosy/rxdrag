import { ICustomEvent } from '../../../interfaces/event'
import { AbstractMouseEvent } from './AbstractMouseEvent'

export class MouseOutEvent
  extends AbstractMouseEvent
  implements ICustomEvent
{
  type = 'mouse:out'
}
