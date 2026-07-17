### The Journey and the Bumps

1. Database Architecture & Migrations

- **The Many-to-Many Dilemma:** I had to figure out how to link multiple services to one appointment without using fragile text arrays or frontend hardcoding, which would break historical price tracking if service rates changed. I resolved this by building an `appointment_services` join table with a composite primary key to enforce data integrity and keep queries fast.
- **The Sequential Migration Race:** When creating my custom TypeScript migration runner, using a `forEach` loop fired all SQL queries simultaneously, crashing the database because dependent tables tried to build before their foreign key parents existed. I fixed this by sorting the files alphabetically and switching to a `for...of` loop with `await` to force strict sequential execution.

2. JWT Authentication & Security Infrastructure
   The Exposure Risk: When implementing user registration using RETURNING \*, the database returned the complete record including the newly encrypted password_hash. Sending this directly back to the client over the network would expose a critical security surface area. I eliminated this risk by explicitly destructuring the row object and deleting the password_hash property from the memory block prior to dispatching the HTTP 201 response.

The Enumeration Vulnerability: During the login route setup, I mitigated the risk by standardizing all conditional lookup failure points to throw an identical generic 401 unauthenticated response message.
