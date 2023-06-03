/* eslint-disable react/no-children-prop */

import { Checkbox } from "@chakra-ui/react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { a11yDark } from "./styles";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export const RetroMarkDown = ({ text }: { text: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ node, ...props }) => (
          <a
            target="_blank"
            style={{ color: "#0f82af", textDecoration: "underline" }}
            {...props}
          />
        ),
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              children={String(children).replace(/\n$/, "")}
              style={a11yDark}
              language={match[1]}
              PreTag="div"
              wrapLines
              showLineNumbers
            />
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        },
        input: ({ node, ...props }) =>
          props.type === "checkbox" ? (
            <Checkbox
              size="md"
              colorScheme="green"
              verticalAlign="center"
              defaultChecked={props.checked}
              isReadOnly
              cursor="grab"
              _hover={{ color: "none" }}
              _checked={{ color: "none" }}
            />
          ) : (
            <> {node}</>
          ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
};
