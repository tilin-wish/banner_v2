import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import useAppState from "../store";
import PanelContainer from "./PanelContainer";

type GetTaskResponse = {
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

const ImagePanel = () => {
  const taskId = useAppState((state) => state.taskId);

  const { data, isFetching } = useQuery({
    queryKey: ["tasks", taskId],
    enabled: !!taskId,
    retry: false,
    queryFn: async () => {
      const { data } = await axios.get<GetTaskResponse>(
        import.meta.env.VITE_API_BASE + `/api/tasks?task_id=${taskId}`,
      );
      return data;
    },
    refetchInterval: (data) => (data?.progress !== 100 ? 2000 : false),
  });

  console.log({ progress: data?.progress });

  const renderCaption = () => {
    if (isFetching || (data && data.progress !== 100)) {
      let value: number | undefined = data?.progress;
      if (value === undefined) {
        value = 0;
      } else if (value < 0) {
        value = 0;
      }
      return (
        <div className="h-10 flex items-center gap-1">
          <p className="label-text text-black font-bold text-lg">Progress</p>
          <progress
            className="progress w-56 h-4"
            value={value}
            max="100"
          ></progress>
        </div>
      );
    }
    return (
      <div className="flex h-10 items-center">
        <p className="label-text text-black font-bold text-lg flex items-center">
          Pick your favorite image to
        </p>
        <Link to="/canvas">
          <button className="btn btn-sm btn-neutral ml-2">Customize</button>
        </Link>
      </div>
    );
  };

  return (
    <PanelContainer className="bg-gray-200">
      <div className="flex">{renderCaption()}</div>
      <div className="h-full overflow-y-scroll flex items-center">
        {data?.url && <img src={data?.url} className="w-full" />}
      </div>
    </PanelContainer>
  );
};

export default ImagePanel;
