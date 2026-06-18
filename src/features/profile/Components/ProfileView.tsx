import type { ProfileViewProps } from "@/features/auth/authTypes";

const ProfileView = ({ user }: ProfileViewProps) => {
  const fields = [
    { label: "Full Name", value: user.name },
    { label: "Email Address", value: user.email },
    { label: "Phone Number", value: user.phoneNumber || "—" },
    { label: "User ID", value: `#${user.id}` },
    { label: "Role", value: user.role },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {fields.map((field) => (
        <div key={field.label}>
          <label className="block text-[12px] font-medium text-gray-600 mb-1">
            {field.label}
          </label>
          <div className="bg-gray-50 rounded-lg px-4 py-2.5 text-[13px] text-gray-800">
            {field.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileView;