document.addEventListener('DOMContentLoaded', async () => {
  const contactList = document.getElementById('contactList');

  if (!contactList) {
    console.warn("⚠️ contactList not found on this page.");
    return;
  }

  async function loadContacts() {
    try {
      const res = await fetch('/api/contact');
      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const messages = await res.json();

      if (!Array.isArray(messages) || messages.length === 0) {
        contactList.innerHTML = '<p>No contact messages yet.</p>';
        return;
      }

      contactList.innerHTML = messages.map(msg => {
        const dateStr = msg.date ? new Date(msg.date).toLocaleString() : 'N/A';
        return `
          <div class="contact-card" style="border:1px solid #ddd; padding:10px; margin-bottom:10px; border-radius:6px; background:#f9f9f9;">
            <h3>${msg.name || 'N/A'} (${msg.email || 'N/A'})</h3>
            <p><strong>Phone:</strong> ${msg.phone || 'N/A'}</p>
            <p><strong>Message:</strong> ${msg.message || 'N/A'}</p>
            <p><em>${dateStr}</em></p>
            <button onclick="deleteMessage('${msg._id}')">🗑 Delete</button>
          </div>
        `;
      }).join('');
    } catch (err) {
      console.error('❌ Error loading messages:', err);
      contactList.innerHTML = '<p>Error loading messages.</p>';
    }
  }

  window.deleteMessage = async (id) => {
    if (!confirm('🗑 Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('✅ Message deleted.');
        loadContacts();
      } else {
        const result = await res.json();
        alert(`❌ Failed to delete message: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('❌ Error deleting message:', err);
      alert('❌ Failed to delete message.');
    }
  };

  loadContacts();
});
