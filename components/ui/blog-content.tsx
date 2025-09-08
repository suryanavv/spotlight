"use client";

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({children, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props}>{children}</h1>,
          h2: ({children, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3" {...props}>{children}</h2>,
          h3: ({children, ...props}) => <h3 className="text-lg font-semibold mt-4 mb-2" {...props}>{children}</h3>,
          p: ({children, ...props}) => <p className="mb-4 leading-relaxed" {...props}>{children}</p>,
          ul: ({children, ...props}) => <ul className="mb-4 ml-6 list-disc" {...props}>{children}</ul>,
          ol: ({children, ...props}) => <ol className="mb-4 ml-6 list-decimal" {...props}>{children}</ol>,
          li: ({children, ...props}) => <li className="mb-1" {...props}>{children}</li>,
          blockquote: ({children, ...props}) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4" {...props}>
              {children}
            </blockquote>
          ),
          code: ({children, ...props}) => (
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono" {...props}>
              {children}
            </code>
          ),
          pre: ({children, ...props}) => (
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4" {...props}>
              {children}
            </pre>
          ),
          a: ({children, ...props}) => (
            <a className="text-blue-600 hover:text-blue-800 underline" {...props}>
              {children}
            </a>
          ),
          strong: ({children, ...props}) => <strong className="font-bold" {...props}>{children}</strong>,
          em: ({children, ...props}) => <em className="italic" {...props}>{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
