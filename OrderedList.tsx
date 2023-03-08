
  // FILE: OrderedList.tsx

  import css from './OrderedList.module.css'
  import {dispatch} from '@brainly/brainiac'
  import {OrderedListEventsType} from './OrderedListEventsType';

  type PropsType = {
    items: ReadonlyArray<{
      heading: string;
      description: string;
    }>;
    type: string;
    emoji: string;
  }
  
  const OrderedList = ({items, type, emoji}: PropsType) => { 
    const handleItemClick = React.useCallback((e) => {
      dispatch<OrderedListOnItemClickType>(e.target, [
        OrderedListEventsType.ON_ITEM_CLICK,
        {
          someValue: type
        }
      ])
    }, [type]);

    const handleListClick = React.useCallback((e) => {
      dispatch<OrderedListOnListClickType>(e.target, [
        OrderedListEventsType.ON_LIST_CLICK,
        {
          someValue: emoji
        }
      ])
    }, [emoji]);

    return (
      <ol className={css.list} onClick={handleListClick} data-testid="my-ordered-list">
        {items.map((item, index) => (
          <li className={css.listItem} onClick={handleItemClick} key={index}>
            <span className={css.heading}>{item.heading}</span>
            <span className={css.description}>{item.description}</span>
          </li>
        ))}
      </ol> 
    )
  }

  export default React.memo<PropsType>(OrderedList);

  // FILE: OrderedListEventsType.ts

  export enum OrderedListEventsType {
    ON_ITEM_CLICK = 'BrnOrderedListOnItemClick',
    ON_LIST_CLICK = 'BrnOrderedListOnListClick'
  }

  export type OrderedListOnItemClickType = [
    OrderedListEventsType.ON_ITEM_CLICK,
    {
      someValue: string
    }
  ]

  export type OrderedListOnListClickType = [
    OrderedListEventsType.ON_LIST_CLICK,
    {
      someValue: string
    }
  ]

  // FILE: OrderedList.module.css

  .list {

  }

  .listItem {

  }

  .heading {

  }

  .description {

  }

  // FILE: OrderedList.spec.tsx
  import {render, screen} from '@testing-library/react'
  import '@testing-library/jest-dom'
  import {OrderedListEventsType} from './OrderedListEventsType';
  import {promiseFromEvent} from '@brainly/brainiac'

  const defaultProps = {
    items: [
      {
        heading: "test heading",
        description: "test description"
      }
    ],
    type: "test type",
    emoji: "test emoji"
  }
  

  describe("<OrderedList />", () => {
    it('renders OrderedList', async () => {
      render(<OrderedList {...defaultProps} />)
  
      expect(screen.getByTestId('my-ordered-list')).toBeInTheDocument();
    })

    it('fires OnItemClick event', async () => {
      render(<OrderedList {...defaultProps} />)
  
      const eventPromise = promiseFromEvent(OrderedListEventsType.ON_ITEM_CLICK);
      const {detail: eventDetail} = await eventPromise();

      expect(eventDetail).toEqual({someValue: defaultProps.type})
    })

    it('fires OnListClick event', async () => {
      render(<OrderedList {...defaultProps} />)
  
      const eventPromise = promiseFromEvent(OrderedListEventsType.ON_LIST_CLICK);
      const {detail: eventDetail} = await eventPromise();

      expect(eventDetail).toEqual({someValue: defaultProps.emoji})
    })
  })

  // FILE: OrderedList.stories.tsx
  import {storiesOf} from '@storybook/react'
  import {OrderedList} from './OrderedList'
  import {text, number, object} from '@storybook/addon-knobs'

  storiesOf('OrderedList', module)
    .add('default', () => (
      <OrderedList 
        items={
          object('items', [
            {
              heading: "test heading",
              description: "test description"
            }
          ])
        }
        type={text('type', 'test type')} 
        emoji={text('emoji', 'test emoji')}
      />
    ))

  // FILE: index.ts
  export {default as OrderedList} from './OrderedList'
  export * from './OrderedListEventsType';

  