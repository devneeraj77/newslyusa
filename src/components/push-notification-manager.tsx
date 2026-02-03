"use client";

import { useEffect, useState } from "react";
import { subscribeUser } from "@/actions/notification-actions";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const VAPID_PUBLIC_KEY = "BJNEUXdlndoDNWUS6crwQPgO4OhQ80jyPC8F9p5tp-rE4VAwrZhCjY_Abvte1SphZo5NfgLMsVzyKgBIHZVBbsI";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationManager() {
  const { data: session } = useSession();
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    async function init() {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        setIsSupported(true);
        try {
           const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
            updateViaCache: "none",
          });
          
          const sub = await registration.pushManager.getSubscription();
          setSubscription(sub);

          // Check if we should show the prompt
          if (!sub) {
            const hasDismissed = localStorage.getItem("notification-prompt-dismissed");
            if (!hasDismissed) {
              timer = setTimeout(() => {
                setShowPrompt(true);
              }, 3000);
            }
          }
        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      }
    }

    init();

    const handleSWMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "PUSH_NOTIFICATION") {
        const { title, body, url } = event.data.payload;
        toast(title, {
          description: body,
          action: {
            label: "Read Now",
            onClick: () => {
              window.location.href = url || "/";
            },
          },
        });
      }
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", handleSWMessage);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", handleSWMessage);
      }
    };
  }, []);

  // Removed separate registerServiceWorker function as it is now inside useEffect
  // kept subscribeToPush and others...

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      setSubscription(sub);
      setShowPrompt(false);
      
      // Send to server
      const result = await subscribeUser(sub.toJSON() as any, session?.user?.id);
      if (result.success) {
          toast.success("Subscribed to notifications!");
      } else {
          toast.error("Failed to save subscription.");
      }
    } catch (error) {
      console.error("Failed to subscribe:", error);
      toast.error("Failed to subscribe", {
        description: error instanceof Error ? error.message : "Unknown error occurred.",
      });
    }
  }

  async function unsubscribeFromPush() {
      try {
          if (subscription) {
              await subscription.unsubscribe();
              setSubscription(null);
              toast.success("Unsubscribed from notifications.");
              // Optionally remove from server, but server handles 410s automatically
          }
      } catch (error) {
          console.error("Failed to unsubscribe", error);
      }
  }

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("notification-prompt-dismissed", "true");
  };

  if (!isSupported) {
    return null;
  }

  return (
    <>
      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Notifications</DialogTitle>
            <DialogDescription>
              Stay updated! Allow notifications to get the latest articles and breaking news delivered right to your device.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-x-2 sm:gap-0">
            <Button variant="outline" onClick={handleDismiss}>
              Maybe Later
            </Button>
            <Button onClick={subscribeToPush}>
              Allow Notifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-4 right-4 z-50">
          {subscription ? (
              <Button variant="outline" size="icon" className="rounded-full shadow-lg bg-background" onClick={unsubscribeFromPush} title="Disable notifications">
                  <BellOff className="h-4 w-4" />
              </Button>
          ) : (
              <Button variant="default" size="icon" className="rounded-full shadow-lg" onClick={subscribeToPush} title="Enable notifications">
                  <Bell className="h-4 w-4" />
              </Button>
          )}
      </div>
    </>
  );
}
