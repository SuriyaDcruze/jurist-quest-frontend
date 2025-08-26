import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Megaphone, Trophy, ChevronDown } from "lucide-react";
import useAnnouncements from "@/hooks/useAnnouncements";
import AnnouncementFeedSkeleton from "@/components/skeleton/TeamDashboard/AnnouncementFeedSkeleton";

const AnnouncementFeed = () => {
  const { announcements, isLoading, error } = useAnnouncements();
  const [closedAnnouncementIds, setClosedAnnouncementIds] = useState<number[]>([]);

  const toggleAnnouncement = (id: number) => {
    setClosedAnnouncementIds((prev) =>
      prev.includes(id) ? prev.filter((annId) => annId !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return <AnnouncementFeedSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Competition Announcements */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Competition Announcements
          </CardTitle>
          <CardDescription className="text-gray-600">
            Stay updated with the latest competition news and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border-b border-gray-200 last:border-b-0">
                <button
                  className="w-full flex justify-between items-center py-4 px-4 text-left"
                  onClick={() => toggleAnnouncement(announcement.id)}
                >
                  <div>
                    <p className="font-medium text-gray-900">{announcement.name}</p>
                    
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${closedAnnouncementIds.includes(announcement.id) ? "" : "rotate-180"}`}
                  />
                </button>
                {!closedAnnouncementIds.includes(announcement.id) && (
                  <div className="p-4 bg-gray-50">
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: announcement.description.replace(/src="\//g, `src="${import.meta.env.VITE_API_URL}/`) }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementFeed;
