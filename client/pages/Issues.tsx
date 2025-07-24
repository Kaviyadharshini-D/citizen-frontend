import { Layout } from "../components/Layout";

export default function Issues() {
  const feedItems = [
    {
      id: 1,
      panchayat: "Village A",
      category: "Road Repair",
      title: "Road in Village A is in poor condition",
      description: "The main road in Village A has deteriorated significantly, causing inconvenience and safety hazards for residents. Immediate repair is needed.",
      upvotes: 100,
      image: "https://api.builder.io/api/v1/image/assets/TEMP/e4a05b6c1afdb6156704aa4eed43f7c3f2e4a869?width=514"
    },
    {
      id: 2,
      panchayat: "Village B",
      category: "Water Supply",
      title: "Water supply issues in Village B",
      description: "Residents of Village B are facing irregular and insufficient water supply. This issue needs urgent attention to ensure access to clean water.",
      upvotes: 100,
      image: "https://api.builder.io/api/v1/image/assets/TEMP/35f7843bd651289d8c40bad265620269c6646608?width=514"
    },
    {
      id: 3,
      panchayat: "Village C",
      category: "Street Lights",
      title: "Non-functional street lights in Village C",
      description: "Many street lights in Village C are not working, leading to safety concerns during the night. Repair or replacement of these lights is required.",
      upvotes: 100,
      image: "https://api.builder.io/api/v1/image/assets/TEMP/076e13ff5608e2d553eb74918239ac10530ad72c?width=514"
    }
  ];

  const filterTabs = ["Latest", "Most Upvoted", "By Category"];

  return (
    <Layout>
      <div className="bg-dashboard-bg min-h-screen">
        <div className="max-w-[960px] mx-auto px-4 lg:px-0">
          {/* Header */}
          <div className="px-4 py-5">
            <h1 className="text-dashboard-text-primary text-[22px] font-bold leading-7">
              Issue Feed
            </h1>
          </div>

          {/* Filter Tabs */}
          <div className="px-3 pb-3">
            <div className="flex flex-wrap gap-3">
              {filterTabs.map((tab, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center h-8 px-4 rounded-lg bg-dashboard-accent cursor-pointer hover:bg-dashboard-border transition-colors ${
                    index === 0 ? "bg-dashboard-accent" : ""
                  }`}
                >
                  <span className="text-dashboard-text-primary text-sm font-medium">
                    {tab}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Feed Items */}
          <div className="space-y-4">
            {feedItems.map((item) => (
              <div key={item.id} className="px-4">
                <div className="bg-dashboard-bg rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      <div className="space-y-1">
                        <div className="text-dashboard-text-secondary text-sm">
                          Panchayat: {item.panchayat} | Category: {item.category}
                        </div>
                        <h3 className="text-dashboard-text-primary text-base font-bold leading-5">
                          {item.title}
                        </h3>
                        <p className="text-dashboard-text-secondary text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      
                      {/* Upvotes */}
                      <div className="inline-flex">
                        <div className="bg-dashboard-accent rounded-lg px-4 py-2">
                          <span className="text-dashboard-text-primary text-sm font-medium">
                            {item.upvotes} Upvotes
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="lg:w-64 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-40 lg:h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
