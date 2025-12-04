import { useEffect, useState } from "react";
import { getAuditLogs } from "../api/securityApi";
import AuditLogs from "../components/AuditLogs";

export default function SecurityPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getAuditLogs().then(res => setLogs(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Security & Audit Logs</h1>
      <AuditLogs logs={logs} />
    </div>
  );
}
