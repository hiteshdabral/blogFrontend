import { createContext, useContext, useReducer } from 'react' 

const AuthContext = createContext() 

export const useAuth = () => {
    return useContext(AuthContext)
}

const reducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN' : {
            return {...state, isLoggedIn: true, profile: action.payload }
        }
        case 'LOGOUT' : {
            return {...state, isLoggedIn: false,  profile: null } 
        }
        case 'SET_PROFILE' : {
            return {...state, profile: action.payload }
        }
        default: {
            return {...state} 
        }
    }
}

export const AuthProvider = ({ children }) => {
    const [user, dispatch] = useReducer(reducer, {
        isLoggedIn: false, 
        profile: null 
    })
  

    return (
      
        <AuthContext.Provider value={{ user, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}