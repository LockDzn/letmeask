import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { database } from '../services/firebase'
import { useAuth } from './useAuth'

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string
      avatar: string
    }
    content: string
    isHighligted: boolean
    isAnswered: boolean
    likes: Record<
      string,
      {
        authorId: string
      }
    >
  }
>

export type QuestionProps = {
  id: string
  content: string
  author: {
    name: string
    avatar: string
  }
  isHighligted: boolean
  isAnswered: boolean
  likeCount: number
  likeId: string | undefined
}

export function useRoom(roomId: string) {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<QuestionProps[]>([])
  const [title, setTitle] = useState('...')

  const history = useHistory()

  useEffect(() => {
    const roomRaf = database.ref(`rooms/${roomId}`)

    roomRaf.on('value', (room) => {
      const databaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighligted: value.isHighligted,
            isAnswered: value.isAnswered,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(
              ([key, like]) => like.authorId === user?.id
            )?.[0],
          }
        }
      )

      setTitle(room.val().title)
      setQuestions(parsedQuestions)
    })

    return () => {
      roomRaf.off('value')
    }
  }, [roomId, user?.id])

  useEffect(() => {
    const roomRaf = database.ref(`rooms/${roomId}`).get()
    roomRaf.then((room) => {
      if (room.val().endedAt) {
        history.push('/')
        alert('Room already closed.')
      }
    })
  }, [roomId, history])

  return { questions, title }
}
