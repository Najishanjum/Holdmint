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
      {/* Neo-Brutalist Header */}
      <div className="bg-[#050505] neo-border neo-shadow p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-[#E8FF00] inline-block animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#E8FF00]">
              SYSTEM FEED // AUDIT LOG DISPATCH
            </span>
          </div>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white">
            Notification Center
          </h2>
          <p className="text-xs text-white/60 font-mono mt-0.5">
            Real-time audit alerts for incoming payments, timelock changes, and statutory deadlines
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="neo-btn flex items-center gap-2 px-4 py-2 bg-[#E8FF00] hover:bg-[#d8ed00] neo-border text-xs font-mono font-black text-black transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>MARK ALL READ</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="p-10 text-center font-mono text-xs text-black/60 bg-white neo-border neo-shadow">
            NO PROTOCOL NOTIFICATIONS RECORDED YET.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white neo-border neo-shadow transition-all ${
                notif.isRead ? "opacity-80" : ""
              }`}
            >
              <div className="bg-[#050505] text-white px-4 py-2 flex items-center justify-between border-b-2 border-black font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 ${notif.isRead ? "bg-white/40" : "bg-[#E8FF00] animate-pulse"}`}></span>
                  <span className="font-bold text-[#E8FF00] uppercase">SYSTEM EVENT</span>
                </div>
                <span className="text-white/60">{new Date(notif.timestamp).toLocaleString()}</span>
              </div>

              <div className="p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-[#5919F6] text-white neo-border shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-lg font-black uppercase tracking-tight text-black">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="px-1.5 py-0.5 bg-[#E8FF00] text-black font-mono text-[9px] font-black uppercase">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-black/80 leading-relaxed">
                      {notif.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {notif.actionUrl && (
                    <Link
                      href={notif.actionUrl}
                      className="neo-btn px-3 py-1.5 bg-[#F2F0F7] hover:bg-[#E8FF00] neo-border text-black font-mono font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <span>VIEW</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  {!notif.isRead && (
                    <button
                      onClick={() => markNotificationAsRead(notif.id)}
                      className="p-1.5 bg-[#F2F0F7] hover:bg-[#21D99B] neo-border text-black transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
