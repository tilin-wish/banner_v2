import { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDebouncedCallback } from "use-debounce";
import useAppState from "../store";

const QuillEditor = () => {
  const promptText = useAppState((state) => state.promptText);
  const setPromptText = useAppState((state) => state.setPromptText);
  const debounced = useDebouncedCallback((value: string) => {
    setPromptText(value);
  }, 500);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          [
            {
              color: [
                "red",
                "blue",
                "yellow",
                "green",
                "black",
                "white",
                "orange",
              ],
            },
          ],
        ],
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  );

  return (
    <div className="bg-gray-100 flex-grow">
      <ReactQuill
        theme="snow"
        defaultValue={promptText}
        value={promptText}
        onChange={debounced}
        modules={modules}
        style={{ height: "100%" }}
      />
    </div>
  );
};

export default QuillEditor;
