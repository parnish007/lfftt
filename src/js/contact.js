document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');

  if (!form) {
    console.warn("⚠️ contactForm not found on this page.");
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim()
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert('✅ Message sent successfully!');
        form.reset();
      } else {
        alert('❌ Failed to send message: ' + (result.error || 'Unknown error.'));
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
      alert('❌ An error occurred. Please try again later.');
    }
  });
});
