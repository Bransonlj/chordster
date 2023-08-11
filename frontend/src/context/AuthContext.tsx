import { createContext, useReducer, useContext, useEffect } from "react";
import { User } from "../types/user";

type UseAuthContextType = {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const initalContext: UseAuthContextType = {
    user: null,
    login: () => {},
    logout: () => {},
}

export const AuthContext = createContext<UseAuthContextType>(initalContext);

type AuthState = {
    user: User | null;
}

type AuthAction = {
    type: 'LOGIN' | "LOGOUT";
    payload: User | null
}

const initialState = {
    user: null
}

export const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload };
        case "LOGOUT":
            return { user: null };
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [state, dispatch] = useReducer(AuthReducer, initialState);

    function login(user: User): void {
        dispatch({
            type: "LOGIN",
            payload: user
        })
    }

    function logout(): void {
        dispatch({
            type: "LOGOUT",
            payload: null,
        })
    }

    useEffect(() => {
        const user = (localStorage.getItem('user'));
        if (user) {
            login(JSON.parse(user));
        }
    }, [])
    
    console.log('AuthContext state:', state)

    return (
        <AuthContext.Provider value={{user: state.user, login, logout}}>
            { children }
        </AuthContext.Provider>
    )
}

// hook

export const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
}