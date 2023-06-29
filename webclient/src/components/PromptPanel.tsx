import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import PanelContainer from "./PanelContainer";

const PromptPanel = () => {
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState("");

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["prompts", text],
    enabled: false,
    retry: false,
    queryFn: async () => {
      const { data } = await axios.get(
        import.meta.env.VITE_API_BASE + "/api/prompts",
        {
          params: { theme: text },
        },
      );
      return data.prompts as string;
    },
  });

  useEffect(() => {
    if (data) {
      setPrompt(data);
    }
  }, [data]);

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
                setPrompt("");
                refetch();
              }}
            >
              {isFetching ? "Generating" : "Genereate Prompt"}
            </button>
          </div>
        </div>
      </div>
      <div className="h-1/2 gap-2 flex flex-col">
        {isFetching ? (
          <p className="flex gap-2">
            <span className="loading loading-spinner text-neutral"></span>
          </p>
        ) : (
          <span className="label-text text-black font-bold text-lg pb-2">
            Feel free to modify the generated prompt
          </span>
        )}
        <div className="flex flex-col gap-2">
          <textarea
            className="textarea textarea-bordered h-60 resize-none
            border-2 
          "
            placeholder=""
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="flex justify-end">
            <button className="btn btn-neutral">Generate Image</button>
          </div>
        </div>
      </div>
    </PanelContainer>
  );
};

export default PromptPanel;
