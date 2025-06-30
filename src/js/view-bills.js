document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.querySelector("#billTable tbody");

  try {
    const res = await fetch("/api/bills/history");
    const bills = await res.json();

    if (!Array.isArray(bills) || bills.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8">No bills sent yet.</td></tr>`;
      return;
    }

    bills.forEach(b => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${b.billId}</td>
        <td>${b.customerName}</td>
        <td>${b.customerEmail}</td>
        <td>${b.packageName}</td>
        <td>${b.packageType}</td>
        <td>${b.price.currency} ${b.price.amount}</td>
        <td>${new Date(b.createdAt).toLocaleString()}</td>
        <td><a href="${b.filePath}" target="_blank" class="download">Download PDF</a></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading bills:", err);
    tbody.innerHTML = `<tr><td colspan="8">Error fetching bills</td></tr>`;
  }
});
