import UnderlinedButton from "@/components/UnderlinedButton";
import { motion } from "framer-motion";

type Props = {
  icon: JSX.Element;
  title: string;
  description: string;
  link: string;
};
const childVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const Benefit = ({ icon, title, description, link }: Props) => {
  return (
    <motion.div
      variants={childVariant}
      className="mt-5 rounded-md border-2 border-secondary-500 dark:border-secondary-200 px-5 py-16 text-center"
    >
      <div className="mb-4 flex justify-center">
        <div className="rounded-full border-2 p-4">{icon}</div>
      </div>
      <h4 className="font-bold">{title}</h4>
      <p className="my-3">{description}</p>

      <UnderlinedButton
        children="Saiba Mais"
        path={link}
        className="text-sm"
        isSection={true}
      />
    </motion.div>
  );
};

export default Benefit;
