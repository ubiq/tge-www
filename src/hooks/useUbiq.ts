import { useContext } from "react";
import { Context } from "../contexts/UbiqProvider";

const useUbiq = () => {
  const { yam } = useContext(Context);
  return yam;
};

export default useUbiq;
