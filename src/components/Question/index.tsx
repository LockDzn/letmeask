import cx from 'classnames'

import './styles.scss'

type Props = {
  content: string
  author: {
    name: string
    avatar: string
  }
  children?: React.ReactNode
  isAnswered?: boolean
  isHighligted?: boolean
}

export const Question = ({
  content,
  author,
  children,
  isAnswered = false,
  isHighligted = false,
}: Props) => {
  return (
    <div
      className={cx(
        'question',
        {
          answered: isAnswered,
        },
        { highligted: isHighligted && !isAnswered }
      )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={`Avatar de ${author.name}`} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  )
}
