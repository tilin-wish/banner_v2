import PanelContainer from "./PanelContainer";

const PromptPanel = () => {
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
            placeholder=""
          />
          <div className="flex justify-end">
            <button className="btn btn-neutral">Generate Promot</button>
          </div>
        </div>
      </div>
      <div className="h-1/2 gap-2 flex flex-col">
        <span className="label-text text-black font-bold text-lg pb-2">
          Modify the prompt to generate image
        </span>
        <div className="flex flex-col gap-2">
          <textarea
            className="textarea textarea-bordered h-60 resize-none
            border-2 
          "
            placeholder=""
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
