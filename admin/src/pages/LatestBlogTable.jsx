import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/LatestBlogTable.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const LatestBlogTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    authors: "",
    imageUrl: "",
    tags: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const res = await axios.get("http://localhost:5000/api/latestblogs");
    setBlogs(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/latestblogs/${id}`);
    fetchBlogs();
  };

  const toggleActive = async (id) => {
    await axios.put(`http://localhost:5000/api/latestblogs/toggle/${id}`);
    fetchBlogs();
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/latestblogs/${id}`);
      const blog = res.data;
      setFormData({
        title: blog.title,
        description: blog.description,
        content: blog.content,
        authors: blog.authors,
        imageUrl: blog.imageUrl,
        tags: blog.tags.join(", "),
      });
      setEditingBlogId(id);
    } catch (err) {
      console.error("Failed to fetch blog:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      };
      await axios.put(`http://localhost:5000/api/latestblogs/${editingBlogId}`, updatedData);
      setEditingBlogId(null);
      fetchBlogs();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="admin-table-container">
      <h2>Latest Blogs</h2>

      <div className="table-scroll-wrapper">
        <table className="blog-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Authors</th>
              <th>Tags</th>
              <th>Homepage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td>
                  <img src={blog.imageUrl} alt="blog" className="blog-thumb" />
                </td>
                <td>{blog.title}</td>
                <td>{blog.authors}</td>
                <td>{blog.tags.join(", ")}</td>
                <td>
                  <span className={`status-badge ${blog.isActive ? "active" : "inactive"}`}>
                    {blog.isActive ? "Yes" : "No"}
                  </span>
                </td>
                <td className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(blog._id)}>Edit</button>
                  <button className="toggle-btn" onClick={() => toggleActive(blog._id)}>
                    {blog.isActive ? "Unactive" : "Active Homepage"}
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(blog._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingBlogId && (
        <div className="modal-backdrop">
          <div className="edit-modal">
            <h3>Edit Blog</h3>

            <label>Title</label>
            <input name="title" value={formData.title} onChange={handleInputChange} />

            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} />

            <label>Content</label>
            <CKEditor
              editor={ClassicEditor}
              data={formData.content}
              onChange={(event, editor) =>
                setFormData((prev) => ({ ...prev, content: editor.getData() }))
              }
            />

            <label>Authors</label>
            <input name="authors" value={formData.authors} onChange={handleInputChange} />

            <label>Image URL</label>
            <input name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} />

            <label>Tags (comma separated)</label>
            <input name="tags" value={formData.tags} onChange={handleInputChange} />

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleUpdate}>Save</button>
              <button className="cancel-btn" onClick={() => setEditingBlogId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LatestBlogTable;
