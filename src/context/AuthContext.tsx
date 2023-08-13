import React, {
  type PropsWithChildren,
  useState,
  useMemo,
  useContext,
} from "react";

interface IAuthContext {
  token: string | null;
  isAuth: boolean;
  signIn: (props: string) => void;
  signOut: () => void;
}

const initContext: IAuthContext = {
  token: "",
  isAuth: false,
  signIn: () => { },
  signOut: () => { },
};

const AuthContext = React.createContext<IAuthContext>(initContext);

export const AuthContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const initialToken = window.localStorage.getItem("refresh_token");
  const [token, setToken] = useState<string | null>(initialToken);
  const userIsLogin = !!token;

  const loginHandler = async (token: string) => {
    setToken(token);
    window.localStorage.setItem("refresh_token", token);
  };

  const logoutHandler = async () => {
    setToken(null);
    window.localStorage.removeItem("refresh_token");
  };

  const contextValue: IAuthContext = useMemo(
    () => ({
      token: String(token),
      isAuth: userIsLogin,
      signIn: loginHandler,
      signOut: logoutHandler,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
