import { useAppSelector } from "../redux";
import Benefits from "./beneficios";
import Home from "./home";
import Modalities from "./modalities";
import GymPlans from "./planos";

export const Main = () => {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <>
      <Home />
      <Benefits />
      <Modalities />
      {user ? null : <GymPlans />}
      {/* <FreeVouncher /> */}
    </>
  );
};
