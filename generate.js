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
# This is example output when user provided name="Button", props="[label,onClick]", classNames=["button", "label"]:

`;

const example = `
  // Button.tsx

  import css from './Button.module.css'

  type PropsType = {
    label: string
    onClick: () => void
  }
  
  export const Button = ({label, onClick}: PropsType) => { 
    return <button className={css.button} onClick={onClick}>
    <span className={css.label}>{label}</span>
    </button> 
  }


  // Button.module.css

  .button {

  }

  .label {

  }

  // Button.spec.tsx
  import {render, screen} from '@testing-library/react'
  import '@testing-library/jest-dom'

  const defaultProps = {
    label: 'test label value'
    onClick: () => undefined
  }

  it('renders Button', async () => {
    render(<Button {...defaultProps} />)

    expect(screen.getByText('test label value')).toBeInTheDocument();
  })

  // Button.stories.tsx
  import {storiesOf} from '@storybook/react'
  import {OrderedList} from './OrderedList'

  storiesOf('OrderedList', module)
    .add('default', () => <OrderedList items={['item1', 'item2', 'item3']} onItemClick={() => undefined} />)
    .add('empty', () => <OrderedList items={[]} onItemClick={() => undefined} />)
  `;

const options = {
  name: "OrderedList",
  props: ["items", "onItemClick"],
  classNames: ["list", "listItem"],
};

const request = `
# Create a component, sample css module file, sample jest test file and sample storybook file for the following options:  
# name="${options.name}"
# props="${JSON.stringify(options.props)}"
# classNames="${JSON.stringify(options.classNames)}"
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
    max_tokens: 1024,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ["#"],
  });

  const result = response.data.choices[0].text;

  console.log(result);
  fs.writeFile(`${options.name}.tsx`, result, { flag: "w+" }, (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
};

generate();
