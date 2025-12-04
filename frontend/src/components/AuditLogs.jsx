export default function AuditLogs({ logs }) {
  return (
    <div className="bg-white p-5 rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-3">Security Logs</h2>

      <div className="max-h-80 overflow-y-scroll">
        {logs.map((log, i) => (
          <div key={i} className="border-b py-2">
            <p><b>Actor:</b> {log.actor}</p>
            <p><b>Action:</b> {log.action}</p>
            <p><b>Resource:</b> {log.resourceId}</p>
            <p className="text-gray-500 text-sm">{new Date(log.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
