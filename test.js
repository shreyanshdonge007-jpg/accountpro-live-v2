fetch('https://cautious-meme-production.up.railway.app/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'node_test_1@test.com', password: 'password123', fullName: 'Test User' })
})
.then(async res => {
  const text = await res.text();
  console.log("\n=================================");
  console.log("STATUS CODE:", res.status);
  console.log("THE ERROR IS:", text);
  console.log("=================================\n");
})
.catch(err => console.log("NETWORK CRASH:", err));
