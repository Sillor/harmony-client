# Harmony

This is the client repo for the Harmony app built for Bay Valley Tech.

### Features
- Team management
- Team file management
- Team text chat
- Person to person text chat
- Video and audio chat
- Calendar sync with Google Calendar


## Installation

1. Clone the repo
2. Run `npm install`
3. Run `npm run dev` to start the development server
4. Open http://localhost:5173
5. Setup [server](https://github.com/Sillor/harmony-server)

### Environment Config

- If maintaining this project, copy contents of `.env.local.example` to a new file named `.env.local`. Don't delete `.env.local.example`

- Otherwise, you can rename `.env.local.example` to `.env.local` or follow the previous option

`VITE_SIGNALING_SERVER_ORIGIN` is only used when `import.meta.env.MODE !== "production"`. Used for connecting to a server not hosted on your machine. It should be the same as `VITE_SERVER_ORIGIN`, unless you want to connect to an external server.

```py
# Server origins
# OK:  http://localhost:5000
# BAD: http://localhost:5000/
VITE_SERVER_ORIGIN=""

# Only used when not in "production" mode
VITE_SIGNALING_SERVER_ORIGIN=""

# EXAMPLE
# VITE_SERVER_ORIGIN="http://localhost:5000"
# VITE_SIGNALING_SERVER_ORIGIN="https://example.com/signaling"
```


## Building

Run `npm run build -- --outDir {your/server/directory}/dist`


## Future

- Integrate Monaco Editor
  - file editing / viewing
- Dropdown menu on "Dashboard" button in sidebar
  - Lists all teams with chat and call buttons next their team name
- More customization options
  - theme editor
  - team background images
- Team project boards (kanban)
- Additions to profile page
- Video Call background blur
- Audio Call background noise cancellation
- Adjust users' audio volume in calls
- Calendar