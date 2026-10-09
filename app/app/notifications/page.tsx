"use client";

import React from "react";
import Link from "next/link";
import { Bell, CheckCheck, Clock, ShieldCheck, ArrowRight, Check } from "lucide-react";
import { useVault } from "@/lib/store/vault-store";

export default function NotificationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useVault();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-bold text-primary">Notification Center</h2>
          <p className="text-xs text-muted mt-0.5">
            Audit alerts for incoming payments, timelock changes, and deadlines
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-border border border-border text-xs text-muted hover:text-primary transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted bg-surface rounded-card border border-border">
            No notifications recorded yet.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                notif.isRead
                  ? "bg-surface border-border opacity-75"
                  : "bg-surface border-border shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-surface-elevated text-spend shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-primary">{notif.title}</h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-tax" />
                    )}
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{notif.description}</p>
                  <span className="text-[10px] text-muted font-mono block">
                    {new Date(notif.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-center">
                {notif.actionUrl && (
                  <Link
                    href={notif.actionUrl}
                    className="p-1.5 rounded-lg hover:bg-surface-elevated text-muted hover:text-primary transition-colors text-xs flex items-center gap-1"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                {!notif.isRead && (
                  <button
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="p-1.5 rounded-lg hover:bg-surface-elevated text-muted hover:text-primary transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
