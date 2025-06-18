document.addEventListener("DOMContentLoaded", () => {
  const requestList = document.getElementById("requestList");

  if (!requestList) {
    console.warn("⚠️ requestList not found on this page.");
    return;
  }

  // 🔄 Load requests from backend
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
        card.style.border = "1px solid #ccc";
        card.style.padding = "16px";
        card.style.margin = "12px 0";
        card.style.borderRadius = "8px";
        card.style.background = "#f9f9f9";
        card.style.boxShadow = "0 2px 5px rgba(0,0,0,0.05)";

        card.innerHTML = `
          <h3>${req.origin} → ${req.destination}</h3>
          <p><strong>Name:</strong> ${req.name || 'N/A'}</p>
          <p><strong>Phone:</strong> ${req.phone || 'N/A'}</p>
          <p><strong>Budget:</strong> NPR ${req.budget || 'N/A'}</p>
          <p><strong>Days:</strong> ${req.days || 'N/A'}</p>
          <p><strong>Vehicle:</strong> ${req.vehicle || 'N/A'}</p>
          <p><strong>Special Requirements:</strong> ${req.message || 'N/A'}</p>
          <p><strong>Status:</strong> 
            <span style="font-weight:bold; color:${
              req.status === 'Approved' ? '#28a745' :
              req.status === 'Rejected' ? '#dc3545' : '#333'
            }">${req.status || 'Pending'}</span>
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
    if (!confirm("Approve this request?")) return;
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
    if (!confirm("Reject this request?")) return;
    try {
      const res = await fetch(`/api/customize/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected" })
      });
      if (!res.ok) throw new Error("Failed to reject request");
      alert("✅ Request rejected!");
      loadRequests();
    } catch (err) {
      console.error("❌ Error rejecting request:", err);
      alert("❌ Failed to reject request.");
    }
  };

  window.deleteRequest = async (id) => {
    if (!confirm("⚠ Are you sure you want to delete this request permanently?")) return;
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
