const LeavesManagerDocs = () => {
  return (
    <div className="container h-75vh overflow-y-scroll mx-auto rounded-lg scrollbar-width-none">
      {/* Overview Section */}
      <h1 className="text-4xl font-bold text-center text-gray-200">
        App Documentation
      </h1>
      <h4 className="text-base text-gray-300 font-medium text-center my-2">
        A Complete Workforce Management Solution
      </h4>
      <h2 className="text-4xl font-semibold text-slate-300 mb-4 mt-10">
        Overview
      </h2>
      <p className="text-slate-400 mb-4 text-lg">
        The <span className="font-bold">Leaves Manager App</span> is an internal
        tool designed to streamline employee leave management, bug tracking, and
        company policy access. It provides a structured approach for employees
        to request leaves, report issues, and access company policies, while
        enabling managers and admins to oversee and take necessary actions
        efficiently.
      </p>

      {/* Pages and Features Section */}
      <h2 className="text-4xl font-semibold text-slate-300 mt-14">
        Pages and Features
      </h2>

      <h3 className="text-2xl font-semibold mt-6 text-slate-300">Dashboard</h3>
      <ul className="list-disc list-inside pl-2 text-slate-400 text-lg">
        <li className="mt-2">
          <span className="font-bold">Displays employee details:</span> Name,
          Role, Email, Phone, Join Date, Employee ID.
        </li>
        <li className="mt-2">
          <span className="font-bold">Quick Actions:</span> "Report Bug", "Apply
          Leave", "View Policies".
        </li>
        <li className="mt-2">
          <span className="font-bold">Filters & Search:</span> Filter employees
          by team or search by name/ID.
        </li>
      </ul>

      <h3 className="text-2xl font-semibold mt-10 text-slate-300">
        View Updates
      </h3>
      <ul className="list-disc list-inside pl-2 text-lg mt-4 text-slate-400">
        <li className="mt-2">
          Displays latest employee updates & activity logs.
        </li>
        <li className="mt-2">
          Supports <span className="font-bold">Table View</span> and{" "}
          <span className="font-bold">Card View</span>.
        </li>
        <li className="mt-2">Allows sorting, searching, and exporting data.</li>
      </ul>

      <h3 className="text-2xl font-semibold mt-10 text-slate-300">
        View Leaves
      </h3>
      <ul className="list-disc list-inside pl-2 text-lg mt-4 text-slate-400">
        <li className="mt-2">Shows leave requests & history.</li>
        <li className="mt-2">
          <span className="font-bold">Managers:</span> Approve/reject leave
          requests.
        </li>
        <li className="mt-2">
          <span className="font-bold">Filters:</span> By type, status, and
          duration.
        </li>
        <li className="mt-2">Export leave data in Excel/PDF format.</li>
      </ul>

      <h3 className="text-2xl font-semibold mt-10 text-slate-300">
        My Profile
      </h3>
      <ul className="list-disc list-inside pl-2 text-lg mt-4 text-slate-400">
        <li className="mt-2">View and update user details.</li>
        <li className="mt-2">Manage security settings (password & 2FA).</li>
      </ul>

      <h3 className="text-2xl font-semibold mt-10 text-slate-300">
        Register User
      </h3>
      <ul className="list-disc list-inside pl-2 text-lg mt-4 text-slate-400">
        <li className="mt-2">HR can add new employees.</li>
        <li className="mt-2">Assigns roles & departments.</li>
        <li className="mt-2">Validates unique Employee ID & email.</li>
      </ul>

      {/* API Routes Section */}
      <h2 className="text-4xl font-semibold text-slate-300 mt-14">
        🛠 API Routes
      </h2>
      <ul className="list-disc list-inside pl-2 text-lg mt-4 text-slate-400">
        <li className="mt-2">
          <span className="font-bold">/api/delete-user:</span> Deletes a user
          from Firebase Auth.
        </li>
        <li className="mt-2">
          <span className="font-bold">/api/read-cookie:</span> Reads stored
          authentication cookies.
        </li>
        <li className="mt-2">
          <span className="font-bold">/api/send-email:</span> Sends login
          details to new users.
        </li>
        <li className="mt-2">
          <span className="font-bold">/api/send-notification:</span> Sends leave
          approval/rejection notifications.
        </li>
        <li className="mt-2">
          <span className="font-bold">/api/upload-image:</span> Allows users to
          upload screenshots for bug reports.
        </li>
      </ul>

      {/* Folder Structure Section */}
      <h2 className="text-4xl font-semibold text-slate-300 mt-14">
        Next.js App Folder Structure
      </h2>
      <ul className="list-disc list-inside pl-2 text-lg mt-4 text-slate-400">
        <li className="mt-2">
          <span className="font-bold">app/:</span> Main application directory.
        </li>
        <li className="mt-2">
          <span className="font-bold">api/:</span> Backend API routes.
        </li>
        <li className="mt-2">
          <span className="font-bold">components/:</span> Reusable UI
          components.
        </li>
        <li className="mt-2">
          <span className="font-bold">context/:</span> Global React state
          management.
        </li>
        <li className="mt-2">
          <span className="font-bold">functions/:</span> Utility functions.
        </li>
        <li className="mt-2">
          <span className="font-bold">styles/:</span> Tailwind CSS styles.
        </li>
      </ul>

      {/* Configuration Files Section */}
      <h2 className="text-4xl font-semibold text-slate-300 mt-14">
        Configuration Files
      </h2>
      <ul className="list-disc list-inside pl-2 text-lg mt-4 text-slate-400">
        <li className="mt-2">
          <span className="font-bold">.env.local:</span> Environment variables.
        </li>
        <li className="mt-2">
          <span className="font-bold">next.config.js:</span> Next.js
          configuration.
        </li>
        <li className="mt-2">
          <span className="font-bold">tailwind.config.ts:</span> Tailwind CSS
          settings.
        </li>
        <li className="mt-2">
          <span className="font-bold">tsconfig.json:</span> TypeScript
          configuration.
        </li>
      </ul>

      {/* Conclusion Section */}
      <h2 className="text-4xl font-semibold text-slate-300 mt-14">
        Conclusion
      </h2>
      <p className="text-slate-400 pl-2 mt-4 pb-10 text-lg">
        The <span className="font-bold">Leaves Manager App</span> is a robust
        tool for leave tracking, issue reporting, and policy access. Future
        updates will include <span className="font-bold">Bug Analytics</span>,
        <span className="font-bold">Audit Logs</span>,{" "}
        <span className="font-bold">Dark Mode</span>, and more to enhance user
        experience.
      </p>
    </div>
  );
};

export default LeavesManagerDocs;
