import { useContext } from "react";
import { Context } from "../contexts/UbiqProvider";

const useUbiq = () => {
  const { ubiq } = useContext(Context);
  return ubiq;
};

export default useUbiq;
