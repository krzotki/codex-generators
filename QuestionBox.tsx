

// FILE: QuestionBox.tsx

import * as React from 'react'
import css from './QuestionBox.module.css'
import {dispatch} from '@brainly/brainiac'
import {QuestionBoxEventsType} from './QuestionBoxEventsType';
import {Flex, Icon, Text} from 'brainly-style-guide'

type PropsType = {
  questionContent: string;
  author: string;
  showActions: boolean;
  options: any;
  breadcrumbs: any;
  copy: Readonly<{
    title: string;
    addAnswer: string;
    seeAnswers: string;
    addComment: string;
  }>
  comments: any;
}

const QuestionBox = ({questionContent, author, showActions, options, breadcrumbs, copy, comments}: PropsType) => { 
  const handleAddAnswerClick = React.useCallback((e) => {
    dispatch<QuestionBoxOnAddAnswerClickType>(e.target, [
      QuestionBoxEventsType.ON_ADD_ANSWER_CLICK,
      {
        questionContent
      }
    ])
  }, [questionContent]);

  const handleSeeAnswersClick = React.useCallback((e) => {
    dispatch<QuestionBoxOnSeeAnswersClickType>(e.target, [
      QuestionBoxEventsType.ON_SEE_ANSWERS_CLICK,
      {
        questionContent
      }
    ])
  }, [questionContent]);

  const handleAddCommentClick = React.useCallback((e) => {
    dispatch<QuestionBoxOnAddCommentClickType>(e.target, [
      QuestionBoxEventsType.ON_ADD_COMMENT_CLICK,
      {
        questionContent
      }
    ])
  }, [questionContent]);

  const handleAuthorMouseOver = React.useCallback((e) => {
    dispatch<QuestionBoxOnAuthorMouseOverType>(e.target, [
      QuestionBoxEventsType.ON_AUTHOR_MOUSE_OVER,
      {
        author
      }
    ])
  }, [author]);

  return (
    <Flex className={css.container} data-testid="question-box">
      <Flex className={css.content}>
        <Text>{questionContent}</Text>
        <Flex className={css.author} onMouseOver={handleAuthorMouseOver}>
          <Icon type="user" />
          <Text>{author}</Text>
        </Flex>
        {showActions && (
          <Flex className={css.actions}>
            <Text onClick={handleAddAnswerClick}>{copy.addAnswer}</Text>
            <Text onClick={handleSeeAnswersClick}>{copy.seeAnswers}</Text>
            <Text onClick={handleAddCommentClick}>{copy.addComment}</Text>
          </Flex>
        )}
        {options && (
          <Flex className={css.options}>
            {options.map((option, index) => (
              <Text key={index}>{option}</Text>
            ))}
          </Flex>
        )}
        {breadcrumbs && (
          <Flex className={css.breadcrumbs}>
            {breadcrumbs.map((breadcrumb, index) => (
              <Text key={index}>{breadcrumb}</Text>
            ))}
          </Flex>
        )}
        {comments && (
          <Flex className={css.comments}>
            {comments.map((comment, index) => (
              <Text key={index}>{comment}</Text>
            ))}
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}

export default React.memo<PropsType>(QuestionBox);

// FILE: QuestionBoxEventsType.ts

export enum QuestionBoxEventsType {
  ON_ADD_ANSWER_CLICK = 'BrnQuestionBoxOnAddAnswerClick',
  ON_SEE_ANSWERS_CLICK = 'BrnQuestionBoxOnSeeAnswersClick',
  ON_ADD_COMMENT_CLICK = 'BrnQuestionBoxOnAddCommentClick',
  ON_AUTHOR_MOUSE_OVER = 'BrnQuestionBoxOnAuthorMouseOver'
}

export type QuestionBoxOnAddAnswerClickType = [
  QuestionBoxEventsType.ON_ADD_ANSWER_CLICK,
  {
    questionContent: string
  }
]

export type QuestionBoxOnSeeAnswersClickType = [
  QuestionBoxEventsType.ON_SEE_ANSWERS_CLICK,
  {
    questionContent: string
  }
]

export type QuestionBoxOnAddCommentClickType = [
  QuestionBoxEventsType.ON_ADD_COMMENT_CLICK,
  {
    questionContent: string
  }
]

export type QuestionBoxOnAuthorMouseOverType = [
  QuestionBoxEventsType.ON_AUTHOR_MOUSE_OVER,
  {
    author: string
  }
]

// FILE: QuestionBox.module.css

.container {

}

.content {

}

.author {

}

.actions {

}

.comments {

}

.options {

}

.breadcrumbs {

}

// FILE: QuestionBox.spec.tsx
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import {QuestionBoxEventsType} from './QuestionBoxEventsType';
import {promiseFromEvent} from '@brainly/brainiac'
import QuestionBox from './QuestionBox'

const defaultProps = {
  questionContent: "test questionContent",
  author: "test author",
  showActions: true,
  options: ["option1", "option2"],
  breadcrumbs: ["breadcrumb1", "breadcrumb2"],
  copy: {
    title: "test title",
    addAnswer: "test addAnswer",
    seeAnswers: "test seeAnswers",
    addComment: "test addComment"
  },
  comments: ["comment1", "comment2"]
}
  

describe("<QuestionBox />", () => {
  it('renders QuestionBox', async () => {
    render(<QuestionBox {...defaultProps} />)
  
    expect(screen.getByTestId('question-box')).toBeInTheDocument();
  })

  it('fires OnAddAnswerClick event', async () => {
    render(<QuestionBox {...defaultProps} />)
  
    const eventPromise = promiseFromEvent(QuestionBoxEventsType.ON_ADD_ANSWER_CLICK);
    const {detail: eventDetail} = await eventPromise();

    expect(eventDetail).toEqual({questionContent: defaultProps.questionContent})
  })

  it('fires OnSeeAnswersClick event', async () => {
    render(<QuestionBox {...defaultProps} />)
  
    const eventPromise = promiseFromEvent(QuestionBoxEventsType.ON_SEE_ANSWERS_CLICK);
    const {detail: eventDetail} = await eventPromise();

    expect(eventDetail).toEqual({questionContent: defaultProps.questionContent})
  })

  it('fires OnAddCommentClick event', async () => {
    render(<QuestionBox {...defaultProps} />)
  
    const eventPromise = promiseFromEvent(QuestionBoxEventsType.ON_ADD_COMMENT_CLICK);
    const {detail: eventDetail} = await eventPromise();

    expect(eventDetail).toEqual({questionContent: defaultProps.questionContent})
  })

  it('fires OnAuthorMouseOver event', async () => {
    render(<QuestionBox {...defaultProps} />)
  
    const eventPromise = promiseFromEvent(QuestionBoxEventsType.ON_AUTHOR_MOUSE_OVER);
    const {detail: eventDetail} = await eventPromise();

    expect(eventDetail).toEqual({author: defaultProps.author})
  })
})

// FILE: QuestionBox.stories.tsx
import {storiesOf} from '@storybook/react'
import QuestionBox from './QuestionBox'
import {text, boolean, array, object} from '@storybook/addon-knobs'

storiesOf('QuestionBox', module)
  .add('default', () => (
    <QuestionBox 
      questionContent={text('questionContent', 'test questionContent')} 
      author={text('author', 'test author')}
      showActions={boolean('showActions', true)}
      options={
        array('options', ["option1", "option2"])
      }
      breadcrumbs={
        array('breadcrumbs', ["breadcrumb1", "breadcrumb2"])
      }
      copy={
        object('copy', {      
          title: "test title",
          addAnswer: "test addAnswer",
          seeAnswers: "test seeAnswers",
          addComment: "test addComment"
        })
      }
      comments={
        array('comments', ["comment1", "comment2"])
      }
    />
  ))

// FILE: index.ts
export {default as QuestionBox} from './QuestionBox'
export * from './QuestionBoxEventsType';

