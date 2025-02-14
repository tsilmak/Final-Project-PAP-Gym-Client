import { FreeVouncher } from "../freeVouncher";
import { useAppSelector } from "../redux";
import FamiliaOrigem from "./FamiliaOrigem";
import MaquinasOrigem from "./MaquinasOrigem";
import OrigemMain from "./OrigemMain";

const Origem = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <>
      <OrigemMain />
      <MaquinasOrigem />
      <FamiliaOrigem />
      {user ? null : <FreeVouncher />}
    </>
  );
};

export default Origem;
