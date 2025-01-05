// components/EmailSelect.tsx

import React from "react";

interface EmailSelectProps {
  userEmails: string[];
  selectedEmail: string;
  onEmailSelect: (email: string) => void;
}

const EmailSelect: React.FC<EmailSelectProps> = ({ userEmails, selectedEmail, onEmailSelect }) => {
  return (
    <div className="mb-4 flex items-center justify-start w-full md:w-1/3">
      <label htmlFor="emailSelect" className="mb-2 font-semibold text-gray-700 text-lg">
        סינון:
      </label>
      <select
        id="emailSelect"
        value={selectedEmail}
        onChange={(e) => onEmailSelect(e.target.value)}
        className="px-2 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 ease-in-out"
      >
        <option value="">בחר משתמש</option>
        {userEmails.map((email) => (
          <option key={email} value={email}>
            {email}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EmailSelect;
