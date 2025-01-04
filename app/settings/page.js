"use client";

import { useSession } from "next-auth/react";

export default function Settings() {
  const { data: session } = useSession();
  return (
    <>
      <section>
        <div>
          {session?.user.status === "Admin" && (
            <div>
              <h1>Admin Dashboard</h1>
              <p>Full access to all content.</p>
              {/* Контент для админа */}
            </div>
          )}

          {session?.user.status === "Pastor" && (
            <div>
              <h1>Pastor Dashboard</h1>
              <p>Access to pastoral content.</p>
              {/* Контент для пастора */}
            </div>
          )}

          {session?.user.status === "leader" && (
            <div>
              <h1>Leader Dashboard</h1>
              <p>Access to leadership content.</p>
              {/* Контент для лидера */}
            </div>
          )}

          {session?.user.status === "church_member" && (
            <div>
              <h1>Church Member Dashboard</h1>
              <p>Access to church member content.</p>
              {/* Контент для члена церкви */}
            </div>
          )}

          {session?.user.status === "visitor" && (
            <div>
              <h1>Visitor Dashboard</h1>
              <p>Access to visitor content.</p>
              {/* Контент для прихожанина */}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
