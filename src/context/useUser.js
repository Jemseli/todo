import { useContext } from "react";
import { UserContext } from "./UserContex";

export const useUser = () => {
    return useContext(UserContext)
}