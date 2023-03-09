

// FILE: OrderedList.tsx

import css from './OrderedList.module.css'
import { dispatch } from '@brainly/brainiac'
import { OrderedListEventsType } from './OrderedListEventsType'

type PropsType = {
  items: ReadonlyArray<{
    heading: string;
    description: string;
  }>;
  type: string;
  emoji: string;
  copy: ReadonlyArray<{
    heading: string;
    description: string;
  }>
}

const OrderedList = ({ items, type, emoji, copy }: PropsType) => {
  const handleItemClick = React.useCallback((e) => {
    dispatch<OrderedListOnItemClickType>(e.target, [
      OrderedListEventsType.ON_ITEM_CLICK,
      {
        itemIndex: e.target.dataset.index
      }
    ])
  }, []);

  const handleListClick = React.useCallback((e) => {
    dispatch<OrderedListOnListClickType>(e.target, [
      OrderedListEventsType.ON_LIST_CLICK,
      {
        listType: type
      }
    ])
  }, [type]);

  return (
    <ol className={css.list} onClick={handleListClick} data-testid="my-ordered-list">
      {items.map((item, index) => (
        <li key={index} className={css.listItem} onClick={handleItemClick} data-index={index}>
          <h3 className={css.heading}>{item.heading}</h3>
          <p className={css.description}>{item.description}</p>
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
    itemIndex: string
  }
]

export type OrderedListOnListClickType = [
  OrderedListEventsType.ON_LIST_CLICK,
  {
    listType: string
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
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { OrderedListEventsType } from './OrderedListEventsType';
import { promiseFromEvent } from '@brainly/brainiac'

const defaultProps = {
  items: [
    {
      heading: "test heading 1",
      description: "test description 1"
    },
    {
      heading: "test heading 2",
      description: "test description 2"
    }
  ],
  type: "test type",
  emoji: "test emoji",
  copy: [
    {
      heading: "test heading",
      description: "test description"
    }
  ]
}


describe("<OrderedList />", () => {
  it('renders OrderedList', async () => {
    render(<OrderedList {...defaultProps} />)

    expect(screen.getByTestId('my-ordered-list')).toBeInTheDocument();
  })

  it('fires OnItemClick event', async () => {
    render(<OrderedList {...defaultProps} />)

    const eventPromise = promiseFromEvent(OrderedListEventsType.ON_ITEM_CLICK);
    const { detail: eventDetail } = await eventPromise();

    expect(eventDetail).toEqual({ itemIndex: "0" })
  })

  it('fires OnListClick event', async () => {
    render(<OrderedList {...defaultProps} />)

    const eventPromise = promiseFromEvent(OrderedListEventsType.ON_LIST_CLICK);
    const { detail: eventDetail } = await eventPromise();

    expect(eventDetail).toEqual({ listType: defaultProps.type })
  })
})

// FILE: OrderedList.stories.tsx
import { storiesOf } from '@storybook/react'
import { OrderedList } from './OrderedList'
import { text, array, object } from '@storybook/addon-knobs'

storiesOf('OrderedList', module)
  .add('default', () => (
    <OrderedList
      items={
        array('items', [
          {
            heading: "test heading 1",
            description: "test description 1"
          },
          {
            heading: "test heading 2",
            description: "test description 2"
          }
        ])
      }
      type={text('type', 'test type')}
      emoji={text('emoji', 'test emoji')}
      copy={
        object('copy', [
          {
            heading: "test heading",
            description: "test description"
          }
        ])
      }
    />
  ))

// FILE: index.ts
export { default as OrderedList } from './OrderedList'
export * from './OrderedListEventsType';