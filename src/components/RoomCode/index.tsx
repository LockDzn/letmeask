import copyImage from '../../assets/images/copy.svg'

import './styles.scss'

type Props = {
  code: string
}

export const RoomCode = (props: Props) => {
  function CopyRoomCode() {
    navigator.clipboard.writeText(props.code)
  }

  return (
    <button className="room-code" onClick={CopyRoomCode}>
      <div>
        <img src={copyImage} alt="Copiar codigo da sala" />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  )
}
