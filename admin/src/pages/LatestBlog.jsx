import React, { useState } from "react";
import axios from "axios";
import "../style/LatestBlog.css";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LatestBlogTable from "./LatestBlogTable";

const LatestBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    authors: "",
    imageUrl: "",
    tags: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const blogData = {
      ...formData,
      authors: formData.authors ? parseInt(formData.authors) : 1,
      tags: Array.isArray(formData.tags)
        ? formData.tags
        : formData.tags.split(",").map((tag) => tag.trim()),
    };

    if (!blogData.title || !blogData.description || !blogData.content || !blogData.imageUrl) {
      setMessage("All required fields must be filled");
      return;
    }

    try {
      console.log("Submitting blog data:", blogData);
      const res = await axios.post("http://localhost:5000/api/latestblogs", blogData);
      setMessage("Blog successfully posted!");
      setFormData({ title: "", description: "", content: "", authors: "", imageUrl: "", tags: "" });
    } catch (err) {
      console.error(err);
      setMessage("Failed to post blog.");
    }
  };

  return (
    <div className="admin-blog-container">
      <h2>Post a New Blog</h2>
      {message && <p className="message">{message}</p>}
      <form className="admin-blog-form" onSubmit={handleSubmit}>
        <input type="text" name="title" value={formData.title} placeholder="Blog Title" onChange={handleChange} required />
        <input type="text" name="description" value={formData.description} placeholder="Short Description" onChange={handleChange} required />

        <div className="ckeditor-wrapper">
          <label>Main Blog Content</label>
          <CKEditor
            editor={ClassicEditor}
            data={formData.content || ""}
            onChange={(event, editor) => {
              const data = editor.getData();
              setFormData((prev) => ({ ...prev, content: data }));
            }}
          />
        </div>

        <input type="number" name="authors" value={formData.authors} placeholder="Number of Authors" onChange={handleChange} required />

        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            const imageForm = new FormData();
            imageForm.append("image", file);

            try {
              const res = await axios.post("http://localhost:5000/api/latestblogs/upload", imageForm);
              setFormData((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
            } catch (err) {
              console.error("Image upload failed", err);
            }
          }}
        />

        <input type="text" name="tags" value={formData.tags} placeholder="Tags (comma separated)" onChange={handleChange} required />
        <button type="submit">Post Blog</button>
      </form>
      <LatestBlogTable/>
    </div>
  );
};

export default LatestBlog;