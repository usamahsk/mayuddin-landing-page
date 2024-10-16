const navLinks = document.querySelectorAll('.nav-item')
const menuToggle = document.getElementById('navbarSupportedContent')
const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle:false})
navLinks.forEach((l) => {
    l.addEventListener('click', () => { bsCollapse.toggle() })
})

document.getElementById('contactForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  document.getElementById('submitBtn').setAttribute('disabled', true)
  const formData = new FormData(event.target);
  // Send data to the serverless function

  const response = await fetch('/.netlify/functions/sendEmail', {
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(formData.entries())),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    document.getElementById('email').setAttribute('value','')
    document.getElementById('phone').setAttribute('value','')
    document.getElementById('message').setAttribute('value','')
    document.getElementById('submitBtn').setAttribute('disabled', false)
    document.getElementById('card-form').innerHTML = '<h3>We recieved your request will get back to you soon.</h3>'
  } else {
    document.getElementById('submitBtn').setAttribute('disabled', false)

    alert('Error sending email.');
  }
});