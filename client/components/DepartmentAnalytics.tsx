import React from 'react';

interface Issue {
  panchayat: string;
  category: string;
  title: string;
  description: string;
  upvotes: number;
  image: string;
}

const issues: Issue[] = [
  {
    panchayat: "Village A",
    category: "Road Repair",
    title: "Road in Village A is in poor condition",
    description: "The main road in Village A has deteriorated significantly, causing inconvenience and safety hazards for residents. Immediate repair is needed.",
    upvotes: 100,
    image: "https://api.builder.io/api/v1/image/assets/TEMP/510ae645d15994b3c8199360ae459549d01973b3?width=618"
  },
  {
    panchayat: "Village B",
    category: "Water Supply",
    title: "Water supply issues in Village B",
    description: "Residents of Village B are facing irregular and insufficient water supply. This issue needs urgent attention to ensure access to clean water.",
    upvotes: 100,
    image: "https://api.builder.io/api/v1/image/assets/TEMP/6320aecb7609d461f4057ee574d51dfa1c9a9be7?width=618"
  },
  {
    panchayat: "Village C",
    category: "Street Lights",
    title: "Non-functional street lights in Village C",
    description: "Many street lights in Village C are not working, leading to safety concerns during the night. Repair or replacement of these lights is required.",
    upvotes: 100,
    image: "https://api.builder.io/api/v1/image/assets/TEMP/8195657ae6f553957ca1962ee7904a3be5f21dfa?width=618"
  }
];

export function DepartmentAnalytics() {
  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-0 py-4">
      {/* Header */}
      <div className="mb-6 px-4">
        <h1 className="text-xl font-bold text-gray-900 font-jakarta">
          Issue Feed
        </h1>
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
                
                {/* Upvotes Badge */}
                <div className="inline-flex items-center px-4 py-1 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-gray-900 font-jakarta">
                    {issue.upvotes} Upvotes
                  </span>
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
