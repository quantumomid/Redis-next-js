"use server";

import { client } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createBook(formData) {
  const { title, rating, author, blurb } = Object.fromEntries(formData);

  // create new book id
  const id = Math.floor(Math.random() * 100000);

  // add the book to the sorted set: returns 1 if the book has been added otherwise 0 if it already exists
  const unique = await client.zAdd(
    "books",
    {
      value: title,
      score: id,
    },
    { NX: true }
  );

  console.log({ title, unique });
  // 0 will be false
  if (!unique) {
    return { error: "This book has already been added!" };
  }

  // save new hash for the book
  await client.hSet(`books:${id}`, {
    title,
    rating,
    author,
    blurb,
  });

  redirect("/");
}
