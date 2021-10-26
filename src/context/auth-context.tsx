import React, { ReactNode, useState } from "react";
import * as auth from "auth-provider";
import { User } from "screens/project-list/search-panel";
import { http } from "../utils/http";
import { useMount } from "../utils";


interface AuthForm {
  username: string,
  password: string,
}

//刷新页面登录的状态应该为保持
const bootstrapUser = async () => {
  let user = null; //初始化
  const token = auth.getToken(); // 保存token
  if (token) {
    const data = await http("me", { token });
    user = data.user;
  }

  return user;
};

const AuthContext = React.createContext<{
  user: User | null,
  login: (form: AuthForm) => Promise<void>
  register: (form: AuthForm) => Promise<void>
  logout: () => Promise<void>
} | undefined>(undefined);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  //  逻辑处理
  const [user, setUser] = useState<User | null>(null);

  const login = (form: AuthForm) => auth.login(form).then(user => setUser(user));
  const register = (form: AuthForm) => auth.register(form).then(user => setUser(user));
  const logout = () => auth.logout().then(() => setUser(null));

  //保存token
  useMount(() => {
    bootstrapUser().then(setUser)
  });

  /*
  * @children react子节点
  * 需要声明 children是什么类型
  * */
  return <AuthContext.Provider children={children} value={{ user, login, register, logout }} />;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw  new Error("useAuth必须在AuthProvider中使用");
  }

  return context;
};