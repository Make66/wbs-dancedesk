### Q: Where in the code gets targets data fetched for the first time?

The trigger chain is:

locationStore uses Zustand persist — so selectedLocationId is restored from localStorage on page load (key: "locations-storage")
As soon as CourseTargetsLoader mounts and selectedLocationId is non-null, its useEffect fires and fetches:
CourseTargetsLoader.tsx:28

GET /locations/{selectedLocationId}/targets
So the first targets fetch happens when:

CourseTargetsLoader mounts and there's already a persisted location in localStorage
If no location is persisted yet, targets won't be fetched until the user selects a location (which calls setSelectedLocationId). Where is CourseTargetsLoader rendered?

Grep "CourseTargetsLoader" (in /Users/martin/dev/wbs/wbs-dancedesk/customerApp/src)
4 lines of output
It's rendered inside Sidebar.tsx:40.

Summary of first targets fetch:

Where: CourseTargetsLoader.tsx:28
When: The Sidebar mounts (after login), and selectedLocationId is available — either restored from localStorage (immediate) or set by the user picking a location for the first time

### Q: 