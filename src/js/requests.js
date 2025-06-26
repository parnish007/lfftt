document.addEventListener("DOMContentLoaded", () => {
  const requestList = document.getElementById("requestList");

  if (!requestList) {
    console.warn("⚠️ requestList not found on this page.");
    return;
  }

  async function loadRequests() {
    try {
      const res = await fetch("/api/customize");
      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const requests = await res.json();
      requestList.innerHTML = "";

      if (!Array.isArray(requests) || requests.length === 0) {
        requestList.innerHTML = "<p>No custom tour requests found.</p>";
        return;
      }

      requests.forEach(req => {
        if (!req._id || !/^[a-f\d]{24}$/i.test(req._id)) {
          console.warn("⚠️ Skipping invalid request ID:", req._id);
          return;
        }

        const card = document.createElement("div");
        card.className = "request-card";
        card.innerHTML = `
          <h3>${req.origin || "N/A"} → ${req.destination || "N/A"}</h3>
          <p><strong>Name:</strong> ${req.name || 'N/A'}</p>
          <p><strong>Email:</strong> ${req.email || 'N/A'}</p>
          <p><strong>Phone:</strong> ${req.phone || 'N/A'}</p>
          <p><strong>Budget:</strong> ${req.budget ? "NPR " + req.budget : 'N/A'}</p>
          <p><strong>Duration (days):</strong> ${req.duration || 'N/A'}</p>
          <p><strong>Vehicle:</strong> ${req.vehicle || 'N/A'}</p>
          <p><strong>Additional Notes:</strong> ${req.message || 'None'}</p>
          <p class="status"><strong>Status:</strong> 
            <span style="font-weight:bold; color:${
              req.status === 'Approved' ? '#28a745' :
              req.status === 'Rejected' ? '#dc3545' : '#333'
            }">${req.status}</span>
          </p>
          <button class="approve" onclick="approveRequest('${req._id}')">Approve</button>
          <button class="reject" onclick="rejectRequest('${req._id}')">Reject</button>
          <button class="delete" onclick="deleteRequest('${req._id}')">Delete</button>
        `;

        requestList.appendChild(card);
      });

    } catch (err) {
      console.error("❌ Error loading requests:", err);
      requestList.innerHTML = "<p>❌ Failed to load requests.</p>";
    }
  }

  window.approveRequest = async (id) => {
    if (!confirm("✅ Approve this request?")) return;
    try {
      const res = await fetch(`/api/customize/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" })
      });
      if (!res.ok) throw new Error("Failed to approve request");
      alert("✅ Request approved!");
      loadRequests();
    } catch (err) {
      console.error("❌ Error approving request:", err);
      alert("❌ Failed to approve request.");
    }
  };

  window.rejectRequest = async (id) => {
    if (!confirm("🚫 Reject this request?")) return;
    try {
      const res = await fetch(`/api/customize/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected" })
      });
      if (!res.ok) throw new Error("Failed to reject request");
      alert("🚫 Request rejected!");
      loadRequests();
    } catch (err) {
      console.error("❌ Error rejecting request:", err);
      alert("❌ Failed to reject request.");
    }
  };

  window.deleteRequest = async (id) => {
    if (!confirm("🗑️ Are you sure you want to permanently delete this request?")) return;
    try {
      const res = await fetch(`/api/customize/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete request.");
      }
      alert("🗑️ Request deleted.");
      loadRequests();
    } catch (err) {
      console.error("❌ Error deleting request:", err);
      alert("❌ Failed to delete request.");
    }
  };

  loadRequests();
});
