import { Link } from "react-router-dom";
import Image from "../example.jpeg";
import PanelContainer from "./PanelContainer";

const ImagePanel = () => {
  return (
    <PanelContainer className="bg-gray-200">
      <div className="flex">
        <p className="label-text text-black font-bold text-lg flex items-center">
          Pick your favorite image to
        </p>
        <Link to="/canvas">
          <button className="btn btn-sm btn-neutral ml-2">Customize</button>
        </Link>
      </div>
      <div className="h-full overflow-y-scroll grid grid-cols-3 gap-1">
        {new Array(20).fill(undefined).map((_, i) => (
          <div key={i} className="flex justify-center items-center">
            <img src={Image} className="w-60" />
          </div>
        ))}
      </div>
    </PanelContainer>
  );
};

export default ImagePanel;
