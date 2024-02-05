import { client } from "@/lib/db";
import Link from "next/link";

const getBooks = async () => {
  const result = await client.zRangeByScoreWithScores("books", 0, -1);

  const books = await Promise.all(
    result.map(async (book) => {
      const { score } = book;
      return await client.hGetAll(`book:${score}`);
    })
  );
  return books;
};

export default async function Home() {
  const books = await getBooks();
  return (
    <main>
      <nav className="flex justify-between">
        <h1 className="font-bold">Books on Redis!</h1>
        <Link href="/create" className="btn">
          Add a new book
        </Link>
      </nav>

      {
        books.map((book) => (
          <article key={book.title} className="card">
            <h2 className="font-bold">{book.title}</h2>
            <p>By {book.author}</p>
            <p>{book.year}</p>
          </article>
        ))
      }
    </main>
  );
}
