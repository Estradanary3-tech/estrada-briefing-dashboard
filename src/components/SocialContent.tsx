"use client";

import { Briefing } from "@/lib/types";
import { useState } from "react";

export default function SocialContent({ social }: { social: Briefing["socialContent"] }) {
  const [copied, setCopied] = useState(false);

  const copyCaption = async () => {
    await navigator.clipboard.writeText(social.caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-card rounded-2xl p-5 border border-card-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-accent">Social Media</h2>
        <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">
          {social.dayTheme}
        </span>
      </div>

      <div className="bg-background rounded-xl p-4 mb-4 relative">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{social.caption}</p>
        <button
          onClick={copyCaption}
          className="mt-3 w-full py-2 rounded-lg bg-accent/20 text-accent text-sm font-medium active:bg-accent/30 transition-colors"
        >
          {copied ? "Copied!" : "Copy Caption"}
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-muted mb-1">Visual</h3>
          <p className="text-sm">{social.visualDescription}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted mb-1">Best Time to Post</h3>
          <p className="text-sm font-semibold">{social.bestPostingTime}</p>
        </div>

        {social.storyIdeas.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted mb-1">Story Ideas</h3>
            <ul className="space-y-1">
              {social.storyIdeas.map((idea, i) => (
                <li key={i} className="text-sm pl-3 border-l-2 border-accent-dim">{idea}</li>
              ))}
            </ul>
          </div>
        )}

        {social.canvaDesignUrl && (
          <a
            href={social.canvaDesignUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 rounded-lg bg-accent text-background text-center text-sm font-medium active:opacity-80 transition-opacity"
          >
            Open Canva Design
          </a>
        )}
      </div>
    </section>
  );
}
