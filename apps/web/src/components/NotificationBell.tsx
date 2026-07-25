"use client";

import React, { useEffect, useState } from "react";
import { fetchNotificationsAction, markNotificationReadAction } from "@/app/actions";
import { Bell, Check, CircleAlert, Mail } from "lucide-react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadNotifications() {
      const res = await fetchNotificationsAction();
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    }

    loadNotifications();
    const interval = setInterval(loadNotifications, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id: string) => {
    const res = await markNotificationReadAction(id);
    if (res.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 border border-zinc-200 hover:bg-zinc-50 rounded-xl relative text-zinc-600 transition-colors"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center border border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2.5 w-80 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-150">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] text-zinc-500 font-bold bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-150">
                {unreadCount} Unread
              </span>
            )}
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-zinc-400 text-xs italic">
                No notifications received yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border text-xs flex justify-between gap-3 transition-colors ${
                    n.read ? "bg-zinc-50/50 border-zinc-150 text-zinc-500" : "bg-teal-50/20 border-teal-100 text-zinc-800"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-bold text-zinc-950 block">{n.title}</span>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">{n.message}</p>
                    <span className="text-[8px] font-mono text-zinc-400 block">
                      {new Date(n.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="p-1 hover:bg-teal-50 text-teal-600 rounded-md shrink-0 self-start transition-colors"
                      title="Mark as read"
                    >
                      <Check size={12} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
