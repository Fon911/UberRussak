import { neon } from "@neondatabase/serverless";
export async function POST(request: Request) {
  console.log("🚀 API POST /users — запрос получен");

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    console.log("🔌 DATABASE_URL:", process.env.DATABASE_URL);

    const test = await sql`SELECT current_database(), current_user;`;
    console.log("🛠 Connected to DB:", test);

    const { name, email, clerkId } = await request.json();
    console.log("📥 Incoming:", { name, email, clerkId });

    const inserted = await sql`
      INSERT INTO users (name, email, clerk_id)
      VALUES (${name}, ${email}, ${clerkId})
      RETURNING *;
    `;
    console.log("✅ Inserted row:", inserted);

    return Response.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("❌ DB error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
