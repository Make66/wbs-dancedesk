export type Post = {
  id: string;
  title: string | null;
  teaser: string | null;
  text: string | null;
  imageUrl: string;
  author: string;
  date: string;
  startsAt: string;
  endsAt: string;
  courseId: string | null;
  eventId: string | null;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isArchived: boolean;
  isDeleted: boolean;
};
