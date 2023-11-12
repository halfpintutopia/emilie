"use client";

import { useMemo } from "react";
import { useChat } from "ai/react";

type DataType = {
  context: any[];
};

export default function Chat() {
  const { messages, data, input, handleInputChange, handleSubmit } = useChat();
  const languages = ['en', 'de', 'fr']
  const language = 'fr'


  const parsedData = useMemo<DataType[]>(
    () => data?.flatMap((x: string) => [null, JSON.parse(x)]),
    [data]
  );

  // Creating a dictionary with article numbers as keys and article links as values
  const articles = parsedData && parsedData[1].context.reduce((acc, article) => {acc[article.payload.article] = article.payload.link;
                                                          return acc;
                                                          }, {});

  // Change links if language is German or French
    for (const key in articles) {
      let replacement = `/${language}#`

      if (articles.hasOwnProperty(key)) {
        const updatedLink = articles[key].replace("/en#", replacement);
        articles[key] = updatedLink;
      }
    }

  return (
    <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch">
      {messages.length > 0
        ? messages.map((m, i) => (
            <div key={m.id} className="flex flex-col mb-6">
              <b>{m.role === "user" ? "User: " : "AI: "}</b>

              <small className="text-gray-500">
                {parsedData?.[i]?.context
                  ?.map(({ payload }) => payload.article)
                  .join(", ")}
              </small>

              <p className="whitespace-pre-wrap">{m.content.trim()}</p>
            </div>
          ))
        : null}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}