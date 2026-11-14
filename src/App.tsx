import { Link, Navigate, NavLink, useLocation } from "react-router";

import { BranchComposer } from "./branch/BranchComposer";
import { CommentsComposer } from "./comments/CommentsComposer";
import { CommitsComposer } from "./commits/CommitsComposer";

export function App() {
  const { pathname } = useLocation();
  if (!["/commits", "/comments", "/branch"].includes(pathname)) {
    return <Navigate to="/commits" replace />;
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <header className="space-y-4">
          <h1 className="text-center text-lg font-bold">
            <Link to="/commits">Conventional Git Composer</Link>
          </h1>
          <nav className="flex flex-wrap justify-center gap-2">
            {["Branch", "Commits", "Comments"].map((item) => (
              <NavLink
                key={item}
                to={`/${item.toLowerCase()}`}
                className={({ isActive }) =>
                  `rounded px-4 py-2 motion-safe:transition-colors ${isActive ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100" : "bg-foreground/3"}`
                }
              >
                {item}
              </NavLink>
            ))}
          </nav>
        </header>
        <main>
          <div hidden={pathname !== "/commits"}>
            <CommitsComposer />
          </div>
          <div hidden={pathname !== "/comments"}>
            <CommentsComposer />
          </div>
          <div hidden={pathname !== "/branch"}>
            <BranchComposer />
          </div>
        </main>
      </div>
    </div>
  );
}
