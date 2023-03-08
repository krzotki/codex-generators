const { Configuration, OpenAIApi } = require("openai");

require("dotenv").config();
const fs = require("fs");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const context = `
# The following is a React.js component generator. 
# User provides 'name' and 'props' and in return he gets a component named with provided 'name' that uses provided 'props'.
# User also provides "classNames" that are used for styling elements. The project is using css modules.
# User also provides "dataTestId" that is passed to main component and is used to find given element in tests.
# User also provides "events" which are names of events that will be dispatched in component.
# User also provides "copy" which is record of strings. Those string are used to display text in component.
# This is example output when user provided name="Button", props=["imageSrc","type"], classNames=["button", "image", "label"], data-testid="button-test-id", events=["OnClick"], copy=["altText", "label"]:

`;

const example = `
  // FILE: Button.tsx

  import css from './Button.module.css'
  import {dispatch} from '@brainly/brainiac'
  import {ButtonEventsType} from './ButtonEventsType';

  type PropsType = {
    imageSrc: string;
    someId: number;
    copy: ReadonlyArray<{
      altText: string;
      label: string;
    }>
  }
  
  const Button = ({label, someId, imageSrc, copy}: PropsType) => { 
    const handleClick = React.useCallback((e) => {
      dispatch<ButtonOnClickType>(e.target, [
        ButtonEventsType.ON_CLICK,
        {
          someValue: someId
        }
      ])
    }, [someId]);

    return (
      <button className={css.button} onClick={handleClick} data-testid="button-test-id">
        <img alt={copy.altText} src={imageSrc}/>
        <span className={css.label}>{copy.label}</span>
      </button> 
    )
  }

  export default React.memo<PropsType>(Button);

  // FILE: ButtonEventsType.ts

  export enum ButtonEventsType {
    ON_CLICK = 'BrnButtonOnClick'
  }

  export type ButtonOnClickType = [
    ButtonEventsType.ON_CLICK,
    {
      someValue: number
    }
  ]

  // FILE: Button.module.css

  .button {

  }

  .label {

  }

  .image {

  }

  // FILE: Button.spec.tsx
  import {render, screen} from '@testing-library/react'
  import '@testing-library/jest-dom'
  import {ButtonEventsType} from './ButtonEventsType';
  import {promiseFromEvent} from '@brainly/brainiac'

  const defaultProps = {
    imageSrc: "test imageSrc",
    someId: 1,
    copy: {
      altText: "test altText",
      label: "test label",
    }
  }
  

  describe("<Button />", () => {
    it('renders Button', async () => {
      render(<Button {...defaultProps} />)
  
      expect(screen.getByTestId('button-test-id')).toBeInTheDocument();
    })

    it('fires OnClick event', async () => {
      render(<Button {...defaultProps} />)
  
      const eventPromise = promiseFromEvent(ButtonEventsType.ON_CLICK);
      const {detail: eventDetail} = await eventPromise();

      expect(eventDetail).toEqual({someValue: defaultProps.someId})
    })
  })

  // FILE: Button.stories.tsx
  import {storiesOf} from '@storybook/react'
  import {Button} from './Button'
  import {text, number, object} from '@storybook/addon-knobs'

  storiesOf('Button', module)
    .add('default', () => (
      <Button 
        imageSrc={text('imageSrc', 'test imageSrc')} 
        someId={number('someId', 1)}
        copy={
          object('copy', {      
            altText: "test altText",
            label: "test label"
          })
        }
      />
    ))

  // FILE: index.ts
  export {default as Button} from './Button'
  export * from './ButtonEventsType';

  // END_MARK
  `;

const options = {
  name: "OrderedList",
  props: ["items", "type", "emoji"],
  classNames: ["list", "listItem", "heading", "description"],
  dataTestId: "my-ordered-list",
  events: ["OnItemClick", "OnListClick"],
  copy: ["headingText", "descriptionText"]
};

const request = `
# For the following options:  
# name="${options.name}"
# props=${JSON.stringify(options.props)}
# classNames=${JSON.stringify(options.classNames)}
# dataTestId="${options.dataTestId}"
# events=${JSON.stringify(options.events)}
# Create a component, events file, sample css module file, sample jest test file, sample storybook file and index file:

`;

const generate = async () => {
  const response = await openai.createCompletion({
    model: "code-davinci-002",
    prompt: `
    ${context} 
    ${example} 
    ${request}
    `,
    temperature: 0,
    max_tokens: 1500,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ["END_MARK", "#", "// END_MARK"],
  });

  const result = response.data.choices[0].text;

  console.log(result, response.data);
  fs.writeFile(`${options.name}.tsx`, result, { flag: "w+" }, (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
};

generate();
