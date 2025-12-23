import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  route("login", "routes/login.tsx"),

  layout("layouts/protected-layout.tsx", [
    route("admin", "routes/admin.tsx"),
    route("reports", "routes/reports.tsx"),
  ]),
] satisfies RouteConfig;
