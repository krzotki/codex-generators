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
# User also provides "copy" which is record of strings. Those strings are used to display text in component instead of using hardcoded translations. Copy is later included in "props".
# The project uses 'brainly-style-guide' components library containing some of the common building blocks, like: Flex, Accordion, Dropdown, Form, Icon and many more.
# This is example output when user provided name="Button", props=["imageSrc","type"], classNames=["button", "image", "label"], dataTestId="button-test-id", events=["OnClick"], copy=["altText", "label", "tooltipText"]:

`;

const example = `
  // FILE: Button.tsx

  import * as React from 'react'
  import css from './Button.module.css'
  import {dispatch} from '@brainly/brainiac'
  import {ButtonEventsType} from './ButtonEventsType';
  import {Button, Text, Tooltip} from 'brainly-style-guide'

  type PropsType = {
    imageSrc: string;
    someId: number;
    copy: Readonly<{
      altText: string;
      label: string;
      tooltipText: string;
    }>
  }
  
  const Button = ({imageSrc, someId, copy}: PropsType) => { 
    const handleClick = React.useCallback((e) => {
      dispatch<ButtonOnClickType>(e.target, [
        ButtonEventsType.ON_CLICK,
        {
          someValue: someId
        }
      ])
    }, [someId]);

    return (
      <Tooltip content={copy.tooltipText}>
        <Button className={css.button} onClick={handleClick} data-testid="button-test-id">
          <img alt={copy.altText} src={imageSrc}/>
          <Text className={css.label}>{copy.label}</Text>
        </Button> 
      </Tooltip>
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
  import Button from './Button'

  const defaultProps = {
    imageSrc: "test imageSrc",
    someId: 1,
    copy: {
      altText: "test altText",
      label: "test label",
      tooltipText: "test tooltipText"
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
  import Button from './Button'
  import {text, number, object} from '@storybook/addon-knobs'

  storiesOf('Button', module)
    .add('default', () => (
      <Button 
        imageSrc={text('imageSrc', 'test imageSrc')} 
        someId={number('someId', 1)}
        copy={
          object('copy', {      
            altText: "test altText",
            label: "test label",
            tooltipText: "test tooltipText"
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
  name: "QuestionBox",
  props: ["questionContent", "author", "showActions", "options", ,"breadcrumbs", "copy", "comments"],
  classNames: ["container", "content", "author", "actions", "comments", "options"],
  dataTestId: "question-box",
  events: ["OnAddAnswerClick", "OnSeeAnswersClick", "OnAddCommentClick", "OnAuthorMouseOver"],
  copy: ["addAnswer", "seeAnswers", "addComment", "reportQuestion"],
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
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    max_tokens: 2000,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    messages: [
      {
        role: "user",
        content: `
    ${context} 
    ${example} 
    ${request}
    `,
      },
    ],
    stop: ["END_MARK", "#", "// END_MARK"],
  });

  const result = response.data.choices[0].message.content;

  console.log(result, response.data);
  fs.writeFile(`${options.name}.tsx`, result, { flag: "w+" }, (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
};

generate();
