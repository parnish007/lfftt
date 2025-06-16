document.addEventListener('DOMContentLoaded', async () => {
  const contactList = document.getElementById('contactList');

  async function loadContacts() {
    try {
      const res = await fetch('/api/contact');
      const messages = await res.json();

      if (messages.length === 0) {
        contactList.innerHTML = '<p>No contact messages yet.</p>';
        return;
      }

      contactList.innerHTML = messages.map(msg => `
        <div class="contact-card">
          <h3>${msg.name} (${msg.email})</h3>
          <p><strong>Phone:</strong> ${msg.phone || 'N/A'}</p>
          <p><strong>Message:</strong> ${msg.message}</p>
          <p><em>${new Date(msg.date).toLocaleString()}</em></p>
          <button onclick="deleteMessage('${msg._id}')">Delete</button>
        </div>
      `).join('');
    } catch (err) {
      console.error('Error loading messages:', err);
      contactList.innerHTML = '<p>Error loading messages.</p>';
    }
  }

  window.deleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      alert('✅ Message deleted.');
      loadContacts();
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('❌ Failed to delete message.');
    }
  };

  loadContacts();
});
