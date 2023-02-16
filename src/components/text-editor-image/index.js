import { Component } from "react";
import ReactQuill from "react-quill";

const TextEditor = ({ placeholder, onChange, value = "" }) => {
  const modules = {
    toolbar: [
      ["image"],
    ],
  };

  const formats = [
    "image",
  ];

  return (
    <div className="text-editor" style={{maxWidth: "300px"}}>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        onChange={onChange}
        value={value}
      ></ReactQuill>
    </div>
  );
};

export default TextEditor;
