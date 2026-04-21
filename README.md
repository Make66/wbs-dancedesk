# wbs-dancedesk
A wbs-coding school final project of SDG-26

## Eye-Candy for the customer-app
Main goal of the redesign is to offer a clean, modern interface with minimum of technical details as possible. Getting rid of old technocratic approaches and redundancies. Intuitive using of the surface is first rule. Avoid disturbing details where possible. Gamification supports the mindset of the target audience.
* the app opens with a friendly icon and a slogan. There are only two other items on the header: the upload button and Login/Logout
* nicely designed dashboard item for new registrations to be imported/updated to customer database. Confirm registration to consumer using a template, add a todo list for processing payments
* nicely designed dashboard item for all courses this week. Item contains course title, a status, when not default, time slot, instructor and room. Dashboard can by dynamically filtered for course title/room/instructor. On filter change, boxes move animatedly to their new positions.
* on selecting an item, an animated menu pops up to either edit the course data or open the attendance list for that course, prefilled with all registrations
* on adding new items, suggest title and other values based on existing items in this category of items. Used for target groups, groups and courses
* change instructors by dragging them from a sidebar onto a course; all instances of this course get a now instructor
* change room by dragging them from a sidebar onto a course; all instances of this course get a new room
* marking a day as holiday asks for a title and removes all courses from that day
* moving next week/prev week has a slider effect
* animated sidebar menu on the left with tabbed main menu points: registration, course, customer, instructor, room, info, term, settings. Tabs can be dragged to new positions. Allow creation of new items
* course menu offers a design mode: a) options on hover: like hovering over target group to inactivate b) dragging it to a new position; in design mode, target groups can be reactivated. Open/close state of menu is being stored in a state and in local storage on change
* registrations: allow manual registration of a new participant (re-uses registration component)
* a powerful calendar gives full overview over unused rooms

# Feature summary

## Server
* nodejs, express, zod, cors
* database backed by postgres using prisma client, migrations and schema
* DB complexity: 19 DB tables with relations to each other: 1:n, n:n, n:m (see server [README.md](./server/README.md))
* JWT authentication for user and participant with register, login, me, logout and refresh
* API Endpoints: CRUD for all basic schema
* API Endpoints: 29 nested routes for special consumption in the customerApp (Admin) to reflect the business logic
* api usage logging
* Automatically deployed using github actions to api.kurstool.de, 
* runs behind nginx proxy, https terminated. 
* Systemd service, survives reboots

## Admin SPA
* Automatically deployed using github actions to admin.kurstool.de
* served /dist/ by nginx, https terminated
* responsive: mobile & desktop optimized
* dashboard for business overview that integrates remote news feed
* widely used drag-and-drop, wherever meaningful
* design mode to adopt the user interface. Used in dashboard, targets, categories
* ability to change foreground- background color of items, add icons
* ability to deactivate items so the can be excluded from display on customers business website
* file upload for instructors, participants, rooms etc.
* dark mode available
* working on a tree-like business structur of customers / locations / targets / categories / courses
* individually styled forms for maximized usability and brand UI
* featuring a week overview
* featuring a day/week/month calendar for events and courses broken down to room level
* strong settings so the user can adopt as much of the apps behavior by himself

## Consumer App
React-Native app based on expo and react-hook-form (zod, zustand), written fully typed
* Studio selector based on QR code or invitation code
* login scheme JWT with refresh
* Overview of personal items (dashboard)
* Chat for customer service and course booking
* Profile updating with file upload
* Deployment consumerApp: currently deployed to LAN, accessing the server using its local IP address. Future: TestFlight, then AppStore and PlayStore

## Website integration
* Course integration to website on content element-level and selectable by location/target/category
* API service to feed the news of the website to Admin SPA and ConsumerApp using the server as a proxy


# Milestones

## Milestone 1 - reached!
[Minimum setup](./docs/images/Stufe-1.svg)

## Milestone 2 - mostly reached!
[Adding consumer app](./docs/images/Stufe-2.svg)

## Milestone 3
[Adding OAuth](./docs/images/Stufe-3.svg)

## Milestone 4
[Adding user onboarding facilitation](./docs/images/Stufe-4.svg)

# Tools used
* Trello: https://trello.com/b/OBGj6jTR/mein-trello-board
* Figma : https://www.figma.com/design/IMqo4WEwc4F4Tn0y9ve4w5/Ohne-Namen?node-id=0-1&p=f

