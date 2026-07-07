async function run() {
  const res = await fetch('http://localhost:4000/api/public/certifications');
  const data = await res.json();
  console.log('API count:', data.count);
  console.log('API data length:', data.data.length);
  console.log('Titles:', data.data.map(c => c.title));
}

run().catch(console.error);
