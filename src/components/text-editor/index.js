import { Component } from "react";
import ReactQuill from "react-quill";

const TextEditor = ({ placeholder, onChange, value = "" }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "script",
  ];

  return (
    <div className="text-editor" style={{maxWidth: "300px"}}>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      ></ReactQuill>
    </div>
  );
};

export default TextEditor;
