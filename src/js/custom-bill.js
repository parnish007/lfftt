document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("customBillForm");

  if (!form) {
    console.warn("⚠️ customBillForm not found on this page.");
    return;
  }

  // ✅ Autofill from query params
  const params = new URLSearchParams(window.location.search);
  if (params.has("customerName")) form.customerName.value = decodeURIComponent(params.get("customerName"));
  if (params.has("customerEmail")) form.customerEmail.value = decodeURIComponent(params.get("customerEmail"));
  if (params.has("packageName")) form.packageName.value = decodeURIComponent(params.get("packageName"));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const billData = {
      customerName: form.customerName.value.trim(),
      customerEmail: form.customerEmail.value.trim(),
      packageName: form.packageName.value.trim(),
      amount: form.amount.value.trim(),
      currency: form.currency.value,
      description: form.description.value.trim()
    };

    if (!billData.customerName || !billData.customerEmail || !billData.packageName || !billData.amount || !billData.currency) {
      alert("⚠ Please fill all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(billData)
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("✅ Bill sent to customer email!");
        form.reset();
      } else {
        alert(`❌ Failed to send bill: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("❌ Error sending bill:", err);
      alert("❌ Server error. Please try again later.");
    }
  });
});
