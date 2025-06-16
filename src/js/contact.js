document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        alert('✅ Message sent successfully!');
        form.reset();
      } else {
        alert('❌ Failed to send message.');
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
      alert('❌ An error occurred. Please try again later.');
    }
  });
});
