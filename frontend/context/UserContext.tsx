import { createContext, FC, PropsWithChildren, useContext, useState } from 'react'

import { User } from '../shared/user.type'

export interface UserContext {
  user?: User
  // eslint-disable-next-line no-unused-vars
  setUser: (user?: User) => void
}

interface Props {
  initialUser?: User
}

export const UserContextImpl = createContext<UserContext>(null!)

export const UserProvider: FC<PropsWithChildren<Props>> = ({children, initialUser}) => {
  const [user, setUser] = useState<User | undefined>(initialUser)

  return <UserContextImpl.Provider value={{user, setUser}}>{children}</UserContextImpl.Provider>

}

export function useUser() {
  return useContext(UserContextImpl)
}
