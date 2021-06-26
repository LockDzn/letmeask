import Modal from 'react-modal'
import { useHistory, useParams } from 'react-router-dom'

import logoImage from '../assets/images/logo.svg'
import deleteImage from '../assets/images/delete.svg'
import deletedImage from '../assets/images/deleted.svg'
import checkImage from '../assets/images/check.svg'
import answerImage from '../assets/images/answer.svg'

import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'
//import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'

import '../styles/room.scss'
import { database } from '../services/firebase'
import { useState } from 'react'

Modal.setAppElement('#root')

type RouteParamsProps = {
  id: string
}

export const AdminRoom = () => {
  const [isOpenEndRoomModal, setIsOpenEndRoomModal] = useState(false)
  const [isOpenDeleteQuestionModal, setIsOpenDeleteQuestionModal] =
    useState(false)
  const [questionIdToDelete, setQuestionIdToDelete] = useState('')

  //const { user, signInWithGoogle } = useAuth()
  const params = useParams<RouteParamsProps>()
  const roomId = params.id

  const history = useHistory()

  const { questions, title } = useRoom(roomId)

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push(`/`)
  }

  function toggleEndRoomModal() {
    setIsOpenEndRoomModal(!isOpenEndRoomModal)
  }

  function toggleDeleteQuestionModal() {
    setIsOpenDeleteQuestionModal(!isOpenDeleteQuestionModal)
  }

  async function handleDeleteQuestion() {
    await database
      .ref(`rooms/${roomId}/questions/${questionIdToDelete}`)
      .remove()
    toggleDeleteQuestionModal()
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })
  }

  async function handleHightlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighligted: true,
    })
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImage} alt="Let Me Ask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={toggleEndRoomModal}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          <span>
            {questions.length}{' '}
            {questions.length === 1 ? 'pergunta' : 'perguntas'}
          </span>
        </div>

        <div className="question-list">
          {questions.map((question, index) => (
            <Question {...question} key={index}>
              {!question.isAnswered && (
                <>
                  <button
                    type="button"
                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                  >
                    <img
                      src={checkImage}
                      alt="Marcar como respondida a pergunta"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHightlightQuestion(question.id)}
                  >
                    <img src={answerImage} alt="Dar destaque na pergunta" />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  setQuestionIdToDelete(question.id)
                  toggleDeleteQuestionModal()
                }}
              >
                <img src={deleteImage} alt="Remover pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>

      <Modal
        isOpen={isOpenEndRoomModal}
        onRequestClose={toggleEndRoomModal}
        contentLabel="End room"
        className="endRoomModal"
        overlayClassName="endRoomModalOverlay"
      >
        <img src={deletedImage} alt="Icone de deletar" />
        <h2>Encerrar sala</h2>
        <p>Tem certeza que você deseja encerrar esta sala?</p>
        <div className="actions">
          <button onClick={toggleEndRoomModal}>Cancelar</button>
          <button className="confirm" onClick={handleEndRoom}>
            Sim, encerrar
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isOpenDeleteQuestionModal}
        onRequestClose={toggleDeleteQuestionModal}
        contentLabel="Delete question"
        className="endRoomModal"
        overlayClassName="endRoomModalOverlay"
      >
        <img src={deletedImage} alt="Icone de deletar" />
        <h2>Excluir pergunta</h2>
        <p>Tem certeza que você deseja excluir esta pergunta?</p>
        <div className="actions">
          <button onClick={toggleDeleteQuestionModal}>Cancelar</button>
          <button className="confirm" onClick={handleDeleteQuestion}>
            Sim, excluir
          </button>
        </div>
      </Modal>
    </div>
  )
}
