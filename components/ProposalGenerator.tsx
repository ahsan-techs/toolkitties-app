"use client";

import React, { useState } from 'react';

export default function ProposalGenerator() {
  const [formData, setFormData] = useState({
    clientName: '',
    projectTitle: '',
    scopeOfWork: '',
    timeline: '',
    budget: '',
  });

  const [generatedProposal, setGeneratedProposal] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const proposalText = `DEAR ${formData.clientName.toUpperCase() || 'CLIENT'},

PROJECT PROPOSAL: ${formData.projectTitle.toUpperCase() || 'PROJECT TITLE'}

1. OVERVIEW & SCOPE
${formData.scopeOfWork || 'Detailed scope of work will be defined here based on initial requirements.'}

2. TIMELINE & DELIVERABLES
Expected Delivery: ${formData.timeline || 'To be determined'}

3. PRICING & INVESTMENT
Total Estimated Budget: ${formData.budget || 'Custom Quote'}

Thank you for considering this proposal. Looking forward to working with you!`;

    setGeneratedProposal(proposalText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedProposal);
    alert('Proposal copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Proposal Generator</h2>
      
      <form onSubmit={handleGenerate} className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700">Client Name</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            placeholder="e.g. John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Project Title</label>
          <input
            type="text"
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            placeholder="e.g. E-commerce Website Development"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Scope of Work</label>
          <textarea
            name="scopeOfWork"
            rows={4}
            value={formData.scopeOfWork}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            placeholder="Describe the main deliverables and features..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Timeline</label>
            <input
              type="text"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder="e.g. 2 Weeks"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget ($)</label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder="e.g. $500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium"
        >
          Generate Proposal
        </button>
      </form>

      {generatedProposal && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Generated Proposal</h3>
          <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-white p-4 rounded border border-gray-200">{generatedProposal}</pre>
          <button
            onClick={handleCopy}
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded text-sm hover:bg-green-700 transition font-medium"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
