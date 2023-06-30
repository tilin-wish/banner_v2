/* eslint-disable @typescript-eslint/no-non-null-assertion */
import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import { Image, Layer, Stage } from "react-konva";
import { Link } from "react-router-dom";
import useImage from "use-image";
import imageSrc from "../example.jpeg";
import useAppState from "../store";
import PanelContainer from "./PanelContainer";
import QuillEditor from "./QuillEditor";

const ExampleImage = () => {
  const [image] = useImage(imageSrc);
  return <Image image={image} width={800} height={600} />;
};

const TextImage = () => {
  const [image, setImage] = useState<HTMLCanvasElement>();
  const [imageState, setImageState] = useState({
    isDragging: false,
    x: 50,
    y: 50,
  });

  const promptText = useAppState((state) => state.promptText);

  useEffect(() => {
    html2canvas(document.querySelector(".ql-editor")!, {
      backgroundColor: null,
      width: 800,
      height: 200,
    })
      .then((canvas) => {
        // show it inside Konva.Image
        setImage(canvas);
      })
      .catch((e) => console.log(e));
  }, [promptText]);

  return (
    <Image
      image={image}
      draggable
      // fill={imageState.isDragging ? "green" : "transparent"}
      fill="transparent"
      onDragStart={() => setImageState({ ...imageState, isDragging: true })}
      onDragEnd={(e) =>
        setImageState({
          x: e.target.x(),
          y: e.target.y(),
          isDragging: false,
        })
      }
    />
  );
};

const CanvasPage = () => {
  return (
    <PanelContainer>
      <Link to="/">
        <button className="btn btn-sm btn-neutral">Go Back</button>
      </Link>
      <div className="w-full flex h-full">
        {/* Stage - is a div wrapper 
          Layer - is an actual 2d canvas element, so you can have several layers inside the stage
          Rect and Circle are not DOM elements. 
          They are 2d shapes on canvas */}
        <Stage width={800} height={600}>
          <Layer>
            <ExampleImage />
            <TextImage />
          </Layer>
        </Stage>
        <QuillEditor />
      </div>
    </PanelContainer>
  );
};

export default CanvasPage;
