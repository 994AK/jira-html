//人口文件

import React, { ReactNode } from "react";
import { AuthProvider } from "./auth-context";

/*
* @children 子节点
*
* */
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>
    {children}
  </AuthProvider>;
};