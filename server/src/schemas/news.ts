import { z } from 'zod/v4';

export const newsSchema = z.object({
  news: z.string().optional(),
  
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional()
});

export type News = z.infer<typeof newsSchema>;

const newsSampleData: any = {
  "news": [
    {
      "uid": 2,
      "tags": [],
      "title": "Lorem Ipsum 2",
      "author": "",
      "teaser": "Teaser 2 zu Lorem ipsum dolor sit amet",
      "bodytext": "<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>",
      "datetime": "2026-04-19T08:31:18+02:00",
      "mediaUrl": "fileadmin/Alfred_20201114.jpeg",
      "istopnews": true,
      "categories": [],
      "pathSegment": "lorem-ipsum-2"
    },
    {
      "uid": 1,
      "tags": [],
      "title": "Lorem Ipsum 1",
      "author": "",
      "teaser": "Teaser for Lorem ipsum dolor sit amet",
      "bodytext": "<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>",
      "datetime": "2026-04-19T08:27:18+02:00",
      "mediaUrl": "fileadmin/Mathias_20201114.jpeg",
      "istopnews": false,
      "categories": [],
      "pathSegment": "lorem-ipsum-1"
    }
  ]
};