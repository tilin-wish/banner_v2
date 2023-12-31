import { useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDebouncedCallback } from "use-debounce";
import useAppState from "../store";

// 自定义文字大小
const fontSizeAttr = ["10px", "12px", "14px", "16px", "20px", "24px", "36px"];
const Size = Quill.import("attributors/style/size");
Size.whitelist = fontSizeAttr;
Quill.register(Size, true);

const fontAttr = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida",
];
const Font = Quill.import("formats/font");
Font.whitelist = fontAttr;
Quill.register(Font, true);

const QuillEditor = () => {
  const slogan = useAppState((state) => state.slogan);
  const setSlogan = useAppState((state) => state.setSlogan);
  const debounced = useDebouncedCallback((value: string) => {
    setSlogan(value);
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
          [
            {
              size: fontSizeAttr,
            },
          ],
          [
            {
              font: fontAttr,
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
    <div className="bg-gray-100 w-1/2">
      <ReactQuill
        theme="snow"
        defaultValue={slogan}
        value={slogan}
        onChange={debounced}
        modules={modules}
        style={{ height: "100%" }}
      />
    </div>
  );
};

export default QuillEditor;
