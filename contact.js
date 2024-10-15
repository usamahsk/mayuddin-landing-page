  document.getElementById('contactForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    console.log(JSON.stringify(Object.fromEntries(formData.entries())))
    // Send data to the serverless function
    const response = await fetch('/.netlify/functions/sendEmail', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData.entries())),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert('Email sent successfully!');
    } else {
      alert('Error sending email.');
    }
  });