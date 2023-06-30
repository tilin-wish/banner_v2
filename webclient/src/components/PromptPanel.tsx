import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
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
  const setPromptText = useAppState((state) => state.setPromptText);
  const setPredicationId = useAppState((state) => state.setTaskId);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");

  const { data, isFetching } = useQuery({
    queryKey: ["images", text],
    enabled: !!text,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const theme = textRef.current?.value;
      if (!theme) return;
      const { data } = await axios.post<SubmitPrompt>(
        import.meta.env.VITE_API_BASE + `/api/images?theme=${theme}`,
      );
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setPredicationId(data.task.task_id);
      setPromptText(data.prompt);
    }
  }, [setPromptText, setPredicationId, data]);

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
          Give some keywords to generate prompt
        </span>
        <div className="flex flex-col gap-2">
          <textarea
            className="textarea textarea-bordered h-60 resize-none
            border-2 
          "
            placeholder="type your key word here"
            ref={textRef}
            // onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              className="btn btn-neutral"
              disabled={isFetching}
              onClick={(e) => {
                setPromptText(undefined);
                const textValue = textRef.current?.value;
                if (textValue) {
                  setText(textValue);
                }
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
