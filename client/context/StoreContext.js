import React, {createContext, useReducer} from 'react'
import {useThunkReducer} from 'react-hook-thunk-reducer'
import {reducer, initialState} from './reducers'
import {useActions} from './actions'
// import {useThunks} from './oldThunks'

const StoreContext = createContext(initialState)

const StoreProvider = ({children}) => {
  // const [state, dispatch] = useReducer(reducer, initialState)
  const [state, dispatch] = useThunkReducer(reducer, initialState)
  // const actions = useActions(state, dispatch)
  const actions = useActions(state, dispatch)

  // useEffect(
  //   () => {
  //     console.log({ newState: state })
  //   },
  //   [state]
  // )

  return (
    <StoreContext.Provider value={{state, dispatch, actions}}>
      {children}
    </StoreContext.Provider>
  )
}

export {StoreContext, StoreProvider}
