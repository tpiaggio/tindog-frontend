import Profile from "@/components/profile";

export default function Page() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto">
        <Profile />
      </div>
    </div>
  );
}
