import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Issue {
  panchayat: string;
  category: string;
  title: string;
  description: string;
  image: string;
}

const issues: Issue[] = [
  {
    panchayat: "Village A",
    category: "Road Repair",
    title: "Road in Village A is in poor condition",
    description: "The main road in Village A has deteriorated significantly, causing inconvenience and safety hazards for residents. Immediate repair is needed.",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/510ae645d15994b3c8199360ae459549d01973b3?width=618"
  },
  {
    panchayat: "Village B",
    category: "Water Supply",
    title: "Water supply issues in Village B",
    description: "Residents of Village B are facing irregular and insufficient water supply. This issue needs urgent attention to ensure access to clean water.",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/6320aecb7609d461f4057ee574d51dfa1c9a9be7?width=618"
  },
  {
    panchayat: "Village C",
    category: "Street Lights",
    title: "Non-functional street lights in Village C",
    description: "Many street lights in Village C are not working, leading to safety concerns during the night. Repair or replacement of these lights is required.",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/8195657ae6f553957ca1962ee7904a3be5f21dfa?width=618"
  }
];

export function UserDashboard() {
  const [selectedPanchayat, setSelectedPanchayat] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [submitAnonymously, setSubmitAnonymously] = useState(false);

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-0 py-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 px-4">
        <div className="bg-gray-100 rounded-lg p-6">
          <div className="mb-2">
            <h3 className="text-base font-medium text-gray-900 font-jakarta">
              Total Queries
            </h3>
          </div>
          <div className="text-2xl font-bold text-gray-900 font-jakarta">
            1,234
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-6">
          <div className="mb-2">
            <h3 className="text-base font-medium text-gray-900 font-jakarta">
              Completed
            </h3>
          </div>
          <div className="text-2xl font-bold text-gray-900 font-jakarta">
            876
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-6">
          <div className="mb-2">
            <h3 className="text-base font-medium text-gray-900 font-jakarta">
              Ongoing
            </h3>
          </div>
          <div className="text-2xl font-bold text-gray-900 font-jakarta">
            358
          </div>
        </div>
      </div>

      {/* Post a New Query Section */}
      <div className="mb-8">
        <div className="px-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 font-jakarta">
            Post a New Query
          </h2>
        </div>

        <div className="space-y-4 px-4">
          {/* Panchayat Selector */}
          <div className="relative">
            <select
              value={selectedPanchayat}
              onChange={(e) => setSelectedPanchayat(e.target.value)}
              className="w-full px-6 py-3 bg-gray-50 border border-gray-300 rounded-lg text-base font-jakarta text-gray-900 appearance-none cursor-pointer"
            >
              <option value="">Select Panchayat</option>
              <option value="village-a">Village A</option>
              <option value="village-b">Village B</option>
              <option value="village-c">Village C</option>
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <div className="flex flex-col space-y-1">
                <ChevronUp size={8} className="text-blue-600" />
                <ChevronDown size={8} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Category Selector */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-6 py-3 bg-gray-50 border border-gray-300 rounded-lg text-base font-jakarta text-gray-900 appearance-none cursor-pointer"
            >
              <option value="">Select Category</option>
              <option value="road-repair">Road Repair</option>
              <option value="water-supply">Water Supply</option>
              <option value="street-lights">Street Lights</option>
              <option value="sanitation">Sanitation</option>
              <option value="electricity">Electricity</option>
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <div className="flex flex-col space-y-1">
                <ChevronUp size={8} className="text-blue-600" />
                <ChevronDown size={8} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <textarea
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Describe your Issue here"
              rows={6}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-base font-jakarta placeholder-blue-300 resize-none"
            />
          </div>

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-14 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900 font-jakarta">
                Attach Media (Optional)
              </h3>
              <p className="text-sm text-gray-900 font-jakarta">
                Drag and drop or click to upload
              </p>
            </div>
          </div>

          {/* Submit Anonymously Checkbox */}
          <div className="flex items-center gap-3 px-4">
            <div className="relative">
              <input
                type="checkbox"
                id="submit-anonymously"
                checked={submitAnonymously}
                onChange={(e) => setSubmitAnonymously(e.target.checked)}
                className="sr-only"
              />
              <label
                htmlFor="submit-anonymously"
                className="flex items-center cursor-pointer"
              >
                <div className={`w-5 h-5 border-2 rounded ${submitAnonymously ? 'border-blue-500 bg-blue-500' : 'border-blue-500 bg-gray-50'} flex items-center justify-center`}>
                  {submitAnonymously && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M11.4605 1.99125C11.9485 2.47937 11.9485 3.27063 11.4605 3.75875L5.21053 10.0087C4.72241 10.4967 3.93116 10.4967 3.44303 10.0087L0.943033 7.50875C0.469314 7.01832 0.476093 6.23859 0.958259 5.75648C1.44043 5.27431 2.22006 5.26754 2.71053 5.74125L4.32697 7.3575L9.69322 1.99125C10.1813 1.50327 10.9725 1.50327 11.4605 1.99125Z" fill="white"/>
                    </svg>
                  )}
                </div>
                <span className="ml-3 text-base text-gray-900 font-jakarta">
                  Submit Anonymously
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end px-4">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold font-jakarta">
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Issue Feed Section */}
      <div className="mb-6 px-4">
        <h2 className="text-xl font-bold text-gray-900 font-jakarta">
          Issue Feed
        </h2>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium font-jakarta">
            Latest
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium font-jakarta">
            Most Upvoted
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium font-jakarta">
            By Category
          </button>
        </div>
      </div>

      {/* Issue Feed */}
      <div className="space-y-4 px-4">
        {issues.map((issue, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start gap-4">
              {/* Content */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <div className="text-sm text-blue-600 font-jakarta">
                    Panchayat: {issue.panchayat} | Category: {issue.category}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 font-jakarta leading-tight">
                    {issue.title}
                  </h3>
                  <p className="text-sm text-blue-600 font-jakarta leading-relaxed">
                    {issue.description}
                  </p>
                </div>
                
                {/* Upvote Button */}
                <div className="inline-flex items-center px-4 py-1 bg-gray-100 rounded-lg gap-1">
                  <span className="text-sm font-medium text-gray-900 font-jakarta">
                    Upvote
                  </span>
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.4605 6.27297C11.355 6.37859 11.2118 6.43794 11.0625 6.43794C10.9132 6.43794 10.77 6.37859 10.6645 6.27297L6.5625 2.17023V13.1875C6.5625 13.4982 6.31066 13.75 6 13.75C5.68934 13.75 5.4375 13.4982 5.4375 13.1875V2.17023L1.33547 6.27297C1.11568 6.49276 0.759323 6.49276 0.539531 6.27297C0.319739 6.05318 0.319739 5.69682 0.539531 5.47703L5.60203 0.414531C5.70754 0.308907 5.85071 0.249557 6 0.249557C6.14929 0.249557 6.29246 0.308907 6.39797 0.414531L11.4605 5.47703C11.5661 5.58254 11.6254 5.72571 11.6254 5.875C11.6254 6.02429 11.5661 6.16746 11.4605 6.27297Z" fill="#0D141C"/>
                  </svg>
                </div>
              </div>

              {/* Image */}
              <div className="flex-shrink-0">
                <img
                  src={issue.image}
                  alt={issue.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
