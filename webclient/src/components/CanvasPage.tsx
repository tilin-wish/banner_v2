/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import { Image, Layer, Stage } from "react-konva";
import { Link } from "react-router-dom";
import useImage from "use-image";
import useAppState from "../store";
import PanelContainer from "./PanelContainer";
import QuillEditor from "./QuillEditor";

const GeneratedImage = ({ src }: { src: string }) => {
  const [image] = useImage(src);
  return <Image image={image} width={700} height={700} />;
};

const TextImage = () => {
  const [image, setImage] = useState<HTMLCanvasElement>();
  const [imageState, setImageState] = useState({
    isDragging: false,
    x: 50,
    y: 50,
  });

  const slogan = useAppState((state) => state.slogan);

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
  }, [slogan]);

  return (
    <Image
      image={image}
      draggable
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

type UpscaleResponse = {
  code: number;
  task_id: number;
  progress: number;
  url: string;
  filename: string;
  size: number;
  width: number;
  height: number;
  errmsg: string;
};

const CanvasPage = () => {
  const taskId = useAppState((state) => state.taskId);
  const index = useAppState((state) => state.index);

  const { data, isFetching } = useQuery({
    queryKey: ["upsace", taskId, index],
    enabled: !!taskId,
    retry: false,
    queryFn: async () => {
      const { data } = await axios.get<UpscaleResponse>(
        import.meta.env.VITE_API_BASE +
          `/api/upscale?task_id=${taskId}&index=${index}`,
      );
      return data;
    },
    refetchOnWindowFocus: false,
    refetchInterval: (data) => (data?.progress !== 100 ? 2000 : false),
  });

  return (
    <PanelContainer>
      <div className="flex gap-2">
        <Link to="/">
          <button className="btn btn-sm btn-neutral">Go Back</button>
        </Link>
      </div>
      <div className="w-full flex h-full">
        {!isFetching ? (
          /* Stage - is a div wrapper 
          Layer - is an actual 2d canvas element, so you can have several layers inside the stage
          Rect and Circle are not DOM elements. 
          They are 2d shapes on canvas */
          <Stage width={700} height={600}>
            {data?.url && (
              <Layer>
                <GeneratedImage src={data.url} />

                <TextImage />
              </Layer>
            )}
          </Stage>
        ) : (
          <div className="w-[800px] h-[600px] flex justify-center">
            <span className="loading loading-spinner text-neutral" />
          </div>
        )}
        <QuillEditor />
      </div>
    </PanelContainer>
  );
};

export default CanvasPage;
