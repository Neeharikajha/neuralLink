import React, { useState } from "react";

export default function ProjectModal({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: [],
    requirements: "",
    tags: [],
    difficulty: "intermediate",
    timeCommitment: "part-time",
    projectUrl: "",
    repositoryUrl: ""
  });

  const [currentTech, setCurrentTech] = useState("");
  const [currentTag, setCurrentTag] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || formData.techStack.length === 0) {
      alert("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
    setFormData({
      title: "",
      description: "",
      techStack: [],
      requirements: "",
      tags: [],
      difficulty: "intermediate",
      timeCommitment: "part-time",
      projectUrl: "",
      repositoryUrl: ""
    });
  };

  const addTech = () => {
    if (currentTech.trim() && !formData.techStack.includes(currentTech.trim())) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, currentTech.trim()]
      }));
      setCurrentTech("");
    }
  };

  const removeTech = (tech) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Post Your Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              placeholder="Enter project title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              placeholder="Describe your project"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tech Stack *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                placeholder="Add technology"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              />
              <button
                type="button"
                onClick={addTech}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-2"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="text-purple-300 hover:text-white"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Requirements
            </label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              placeholder="What skills or experience are needed?"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time Commitment
              </label>
              <select
                value={formData.timeCommitment}
                onChange={(e) => setFormData(prev => ({ ...prev, timeCommitment: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="part-time">Part-time</option>
                <option value="full-time">Full-time</option>
                <option value="weekend">Weekend</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project URL
            </label>
            <input
              type="url"
              value={formData.projectUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, projectUrl: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              placeholder="https://your-project.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Repository URL
            </label>
            <input
              type="url"
              value={formData.repositoryUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, repositoryUrl: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition"
            >
              Post Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
