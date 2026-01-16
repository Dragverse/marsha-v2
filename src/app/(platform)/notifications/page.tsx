"use client";

import { useState } from "react";
import { FiBell, FiDollarSign, FiHeart, FiMessageCircle, FiUserPlus, FiVideo } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

interface Notification {
  id: string;
  type: "tip" | "like" | "comment" | "follow" | "video_ready";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  avatar?: string;
}

// Mock notifications - will connect to real data in future
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "tip",
    title: "New Tip Received!",
    message: "You received a 0.005 ETH tip from @dragfan123",
    timestamp: "2 hours ago",
    isRead: false,
    actionUrl: "/dashboard",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80",
  },
  {
    id: "2",
    type: "like",
    title: "New Likes on Your Video",
    message: "Your video 'Makeup Transformation' received 50 new likes",
    timestamp: "5 hours ago",
    isRead: false,
    actionUrl: "/watch/1",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80",
  },
  {
    id: "3",
    type: "follow",
    title: "New Follower",
    message: "@queenofhearts started following you",
    timestamp: "1 day ago",
    isRead: true,
    actionUrl: "/creator/queenofhearts",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80",
  },
  {
    id: "4",
    type: "comment",
    title: "New Comment",
    message: "@dragqueen99 commented: 'Stunning performance! 👑'",
    timestamp: "2 days ago",
    isRead: true,
    actionUrl: "/watch/2",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80",
  },
  {
    id: "5",
    type: "video_ready",
    title: "Video Processing Complete",
    message: "Your video 'Dance Performance' is now live!",
    timestamp: "3 days ago",
    isRead: true,
    actionUrl: "/watch/3",
  },
];

const notificationIcons = {
  tip: FiDollarSign,
  like: FiHeart,
  comment: FiMessageCircle,
  follow: FiUserPlus,
  video_ready: FiVideo,
};

const notificationColors = {
  tip: "text-green-500",
  like: "text-red-500",
  comment: "text-blue-500",
  follow: "text-purple-500",
  video_ready: "text-yellow-500",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-gray-400">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm font-semibold text-[#EB83EA] hover:text-[#E748E6] transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-900 flex items-center justify-center">
              <FiBell className="w-10 h-10 text-gray-600" />
            </div>
            <p className="text-gray-400">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = notificationIcons[notification.type];
            const iconColor = notificationColors[notification.type];

            return (
              <Link
                key={notification.id}
                href={notification.actionUrl || "#"}
                onClick={() => markAsRead(notification.id)}
                className={`block p-4 rounded-[20px] border transition-all hover:border-[#EB83EA]/50 ${
                  notification.isRead
                    ? "bg-[#1a0b2e] border-[#2f2942]"
                    : "bg-[#2a1b3e] border-[#EB83EA]/30"
                }`}
              >
                <div className="flex gap-4">
                  {/* Avatar or Icon */}
                  <div className="flex-shrink-0">
                    {notification.avatar ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#EB83EA]">
                        <Image
                          src={notification.avatar}
                          alt="User"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#0f071a] flex items-center justify-center">
                        <Icon className={`w-6 h-6 ${iconColor}`} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-white">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="flex-shrink-0 w-2 h-2 bg-[#EB83EA] rounded-full mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
