'use client'

import { Episode } from '@/payload-types'
import { ICON_SVG_REACT, ICON_SVG_MUSIC_REACT } from '@/utilities/iconsSvg'
import { Result } from 'drizzle-orm/sqlite-core'
import {
  ActionDispatch,
  Context,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'

const AudioPlayerContext = createContext({ active: false })
const AudioPlayerDispatchContext: Context<ActionDispatch<[action: { type: 'clicked' }]> | null> =
  createContext(null)

export type ContextProps = {
  children: ReactNode
}

function playerReducer(state: { active: boolean }, action: { type: 'clicked' }) {
  console.log('reducer')
  console.log({ action })
  switch (action.type) {
    case 'clicked': {
      return { active: !state.active }
    }
    default: {
      return { active: state.active }
    }
  }
}

export const EpisodeAudioPlayerContext: React.FC<ContextProps> = (props) => {
  const [playerVisible, dispatch] = useReducer(playerReducer, { active: false })
  return (
    <AudioPlayerContext.Provider value={playerVisible}>
      <AudioPlayerDispatchContext.Provider value={dispatch}>
        {props.children}
      </AudioPlayerDispatchContext.Provider>
    </AudioPlayerContext.Provider>
  )
}

export type ListenButtonProps = {
  audioFormat: string
}

export const ListenButton: React.FC<ListenButtonProps> = (props) => {
  const { audioFormat } = props
  const buttonPressed = useContext(AudioPlayerContext)
  const buttonPressedDispatch = useContext(AudioPlayerDispatchContext)

  const onClickHandler = () => {
    console.log('click handler')
    console.log({ buttonPressedDispatch, check: buttonPressedDispatch != null })
    if (buttonPressedDispatch != null) {
      console.log('click handler dispatch')
      buttonPressedDispatch({
        type: 'clicked',
      })
    }
  }
  if (audioFormat !== 'none') {
    const colorClassPart = buttonPressed.active
      ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
      : ''
    return (
      <div className="flex-shrink-0 flex listenButtons">
        <button
          aria-pressed={buttonPressed.active}
          onClick={onClickHandler}
          className={
            'px-2 h-10 mx-1 leading-10 text-nowrap border-gray-200 border-solid border-1 hidden md:block ' +
            colorClassPart
          }
        >
          Listen
        </button>
        <button
          aria-pressed={buttonPressed.active}
          onClick={onClickHandler}
          className={
            'px-2 h-10 mx-1 leading-10 flex-shrink-0 flex items-center text-nowrap border-gray-200 border-solid border-1 md:hidden ' +
            colorClassPart
          }
        >
          <ICON_SVG_REACT
            className={
              'w-6 h-6 ' +
              (buttonPressed.active ? 'fill-white dark:fill-black' : 'fill-black dark:fill-white')
            }
            role="img"
            label="Listen"
            ariaHidden={false}
            svgInner={ICON_SVG_MUSIC_REACT}
          />
        </button>
      </div>
    )
  } else {
    return <></>
  }
}

export type Props = {
  targetEpisode: Episode
  defaultShown?: boolean
}

type AudioPlayerType = 'none' | 'linked' | 'uploaded'

export const EpisodeAudioPlayer: React.FC<Props> = (props) => {
  const { targetEpisode, defaultShown = true } = props

  const [show, setShow] = useState(defaultShown)
  const buttonPressed = useContext(AudioPlayerContext)

  useEffect(() => {
    if (!defaultShown) {
      setShow(buttonPressed.active)
    }
  }, [buttonPressed, defaultShown])

  const targetSeries = targetEpisode.series

  let audioPlayerType: AudioPlayerType = 'none'
  let mp3Url: string | undefined = undefined
  if (targetEpisode.audioFormat === 'linked') {
    audioPlayerType = 'linked'
    mp3Url = targetEpisode.linkedAudioUrl ?? undefined
  } else if (
    targetEpisode.audioFormat === 'uploaded' &&
    typeof targetEpisode.uploadedAudioFile === 'object' &&
    targetEpisode.uploadedAudioFile !== undefined
  ) {
    audioPlayerType = 'uploaded'
    const baseUrl = process.env.APP_URL_TALKS ?? ''
    mp3Url = baseUrl + '/upload/talkaudio/' + (targetEpisode.uploadedAudioFile?.filename ?? '')
  }

  if (show) {
    return (
      <>
        <audio className="w-full" controls={true}>
          <source src={mp3Url} type="audio/mpeg" />
        </audio>
      </>
    )
  } else {
    return <></>
  }
}
