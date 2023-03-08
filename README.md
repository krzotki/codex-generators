# codex-generators

The following uses OpenAI Codex to generate example React.js component with styles, tests and storybook.

By providing options like these:
```js
const options = {
  name: "OrderedList",
  props: ["items", "onItemClick"],
  classNames: ["list", "listItem"],
};

```

We get something like these:

```tsx
    // OrderedList.tsx
    import css from './OrderedList.module.css'

    type PropsType = {
      items: string[]
      onItemClick: (item: string) => void
    }
    
    export const OrderedList = ({items, onItemClick}: PropsType) => { 
      return <ol className={css.list}>
        {items.map((item, index) => <li className={css.listItem} key={index} onClick={() => onItemClick(item)}>{item}</li>)}
      </ol> 
    }

    // OrderedList.module.css
    .list {

    }

    .listItem {

    }

    // OrderedList.spec.tsx
    import {render, screen} from '@testing-library/react'
    import '@testing-library/jest-dom'

    const defaultProps = {
      items: ['item1', 'item2', 'item3']
      onItemClick: () => undefined
    }

    it('renders OrderedList', async () => {
      render(<OrderedList {...defaultProps} />)

      expect(screen.getByText('item1')).toBeInTheDocument();
      expect(screen.getByText('item2')).toBeInTheDocument();
      expect(screen.getByText('item3')).toBeInTheDocument();
    })

    // OrderedList.stories.tsx
    import {storiesOf} from '@storybook/react'
    import {OrderedList} from './OrderedList'

    storiesOf('OrderedList', module)
      .add('default', () => <OrderedList items={['item1', 'item2', 'item3']} onItemClick={() => undefined} />)
      .add('empty', () => <OrderedList items={[]} onItemClick={() => undefined} />)
```
