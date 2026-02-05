import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Terminal } from "lucide-react";

interface MarkdownRendererProps {
    content: string;
}

const CodeBlock = ({ language, children, ...props }: any) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(String(children));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-xl overflow-hidden my-5 border border-white/5 bg-black/30 shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        {language || "text"}
                    </span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-200 transition-colors px-2 py-1 rounded-md hover:bg-white/5"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                className="!bg-transparent !m-0 !p-4 !rounded-none overflow-x-auto text-sm"
                customStyle={{ background: 'transparent', margin: 0 }}
                {...props}
            >
                {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
        </div>
    );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    return (
        <div className="prose prose-invert max-w-none break-words">
            <ReactMarkdown
                components={{
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                            <CodeBlock language={match[1]} {...props}>
                                {children}
                            </CodeBlock>
                        ) : (
                            <code className="bg-white/10 rounded px-1.5 py-0.5 font-mono text-sm text-zinc-200 border border-white/10" {...props}>
                                {children}
                            </code>
                        );
                    },
                    p: ({ children }) => <p className="mb-4 last:mb-0 leading-7 text-zinc-300 font-light">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-6 mb-4 space-y-2 text-zinc-300">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-6 mb-4 space-y-2 text-zinc-300">{children}</ol>,
                    li: ({ children }) => <li className="pl-1">{children}</li>,
                    h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0 text-white">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5 text-white">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-4 text-zinc-100">{children}</h3>,
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary/50 pl-4 italic my-4 text-zinc-400 bg-white/5 py-3 pr-4 rounded-r-lg">
                            {children}
                        </blockquote>
                    ),
                    a: ({ children, href }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 hover:underline transition-all font-medium underline-offset-4 decoration-primary/30">
                            {children}
                        </a>
                    ),
                    hr: () => <hr className="border-white/10 my-6" />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
