// List of routes that should not use token verification middleware
const excludedRoutes = [
  { method: "POST", path: "/login/manager" },
  { method: "POST", path: "/login/player" },
  { method: "GET", path: "/team/exists" },
  { method: "GET", path: "/team/exists/teamId" },
  { method: "POST", path: "/team" },
  { method: "POST", path: "/manager" },
  { method: "PUT", path: "/manager/join-team" },
  { method: "POST", path: "/team/manager" },
  { method: "GET", path: "/manager/accept-invitation/token" },
  { method: "GET", path: "/player/accept-invitation/token" },
  { method: "GET", path: "/player/verify-email/token" },
  { method: "POST", path: "/player" },
  // Add more entries as needed
];

const excludedRoutesStartWith = [
  { method: "GET", path: "/team/exists/teamId" },
  { method: "GET", path: "/manager/exists" },
  { method: "GET", path: "/manager/accept-invitation/token" },
  { method: "GET", path: "/player/accept-invitation/token" },
  { method: "GET", path: "/player/verify-email/token" },
  { method: "PUT", path: "/manager/join-team" },
  
  // Add more entries as needed
];

export { excludedRoutes, excludedRoutesStartWith };
