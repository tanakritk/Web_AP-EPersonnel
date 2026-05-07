import { ReactNode } from "react";

interface CardCustomProps {
  children: ReactNode;
  title: string;
}

const CardCustom = ({ children, title }: CardCustomProps) => {
  return (
    <div className="rounded-lg bg-white ">
      <div className="md:h-16 bg-primary rounded-t-lg items-center flex px-3">
        <span className="text-white  text-lg">
          {title}
        </span>
      </div>
      <div className="flex flex-col lg:flex-row py-3 px-3">
        {children}
      </div>
    </div>
  );
};

export default CardCustom;
