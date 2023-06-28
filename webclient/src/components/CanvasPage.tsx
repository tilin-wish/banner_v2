import { useState } from "react";
import { Image, Layer, Stage, Text } from "react-konva";
import { Link } from "react-router-dom";
import useImage from "use-image";
import imageSrc from "../example.jpeg";
import PanelContainer from "./PanelContainer";

const ExampleImage = () => {
  const [image] = useImage(imageSrc);
  return <Image image={image} width={800} height={600} />;
};

const CanvasPage = () => {
  const [textState, setTextState] = useState({
    isDragging: false,
    x: 50,
    y: 50,
  });

  return (
    <PanelContainer>
      <Link to="/">
        <button className="btn btn-sm btn-neutral ml-2">Go Back</button>
      </Link>
      {/* Stage - is a div wrapper 
          Layer - is an actual 2d canvas element, so you can have several layers inside the stage
          Rect and Circle are not DOM elements. 
          They are 2d shapes on canvas */}
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <ExampleImage />
          <Text
            text="This is a sample text that you can drag"
            x={textState.x}
            y={textState.y}
            fontSize={24}
            draggable
            fill={textState.isDragging ? "green" : "black"}
            onDragStart={() => setTextState({ ...textState, isDragging: true })}
            onDragEnd={(e) =>
              setTextState({
                x: e.target.x(),
                y: e.target.y(),
                isDragging: false,
              })
            }
          />
        </Layer>
      </Stage>
    </PanelContainer>
  );
};

export default CanvasPage;
