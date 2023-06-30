import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import useAppState from "../store";
import PanelContainer from "./PanelContainer";

type SubmitPrompt = {
  prompt: string;
  task: {
    code: number;
    task_id: number;
    progress: number;
    url: string;
    filename: string;
    size: number;
    width: number;
    height: number;
    errmsg: number;
  };
};

const PromptPanel = () => {
  const [text, setText] = useState("");
  const setPromptText = useAppState((state) => state.setPromptText);
  const setPredicationId = useAppState((state) => state.setTaskId);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["images", text],
    enabled: false,
    retry: false,
    queryFn: async () => {
      const { data } = await axios.post<SubmitPrompt>(
        import.meta.env.VITE_API_BASE + `/api/images?theme=${text}`,
      );
      return data;
    },
  });

  if (data) {
    setPredicationId(data.task.task_id);
    setPromptText(data.prompt);
  }

  const renderFooter = () => {
    if (isFetching) {
      return (
        <p className="flex gap-2">
          <span className="loading loading-spinner text-neutral"></span>
        </p>
      );
    }

    if (data?.prompt) {
      return (
        <div className="chat chat-start">
          <div className="chat-bubble">{data.prompt}</div>
        </div>
      );
    }

    return null;
  };

  return (
    <PanelContainer className="justify-center">
      <div className="h-1/2 gap-2 flex flex-col">
        <span className="label-text text-black font-bold text-lg">
          Give some keywords to generate promopt
        </span>
        <div className="flex flex-col gap-2">
          <textarea
            className="textarea textarea-bordered h-60 resize-none
            border-2 
          "
            placeholder="type your key word here"
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              className="btn btn-neutral"
              disabled={isFetching}
              onClick={() => {
                setPromptText(undefined);
                refetch();
              }}
            >
              {isFetching ? "Generating" : "Genereate Prompt"}
            </button>
          </div>
        </div>
      </div>
      <div className="h-1/2">{renderFooter()}</div>
    </PanelContainer>
  );
};

export default PromptPanel;
