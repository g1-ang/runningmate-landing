/**
 * 약관·개인정보처리방침 등 정적 markdown 텍스트 렌더러.
 *
 * 지원 블록: `## h2`, `### h3`, `- 불릿`, `---` 구분선, 빈 줄로 분리되는
 * 단락. iOS 의 LegalContentView 와 같은 단순 line-classifier 방식.
 * **굵게** 인라인 마크다운만 처리하며, 외부 라이브러리 없음.
 */

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "hr" };

function parse(markdown: string): Block[] {
  const result: Block[] = [];
  let bullets: string[] = [];
  let para: string[] = [];

  const flushBullets = () => {
    if (bullets.length > 0) {
      result.push({ type: "ul", items: bullets });
      bullets = [];
    }
  };
  const flushPara = () => {
    if (para.length > 0) {
      result.push({ type: "p", text: para.join(" ") });
      para = [];
    }
  };

  for (const raw of markdown.split("\n")) {
    const line = raw.trim();
    if (line.startsWith("## ")) {
      flushBullets();
      flushPara();
      result.push({ type: "h2", text: line.slice(3) });
    } else if (line.startsWith("### ")) {
      flushBullets();
      flushPara();
      result.push({ type: "h3", text: line.slice(4) });
    } else if (line.startsWith("- ")) {
      flushPara();
      bullets.push(line.slice(2));
    } else if (line === "---") {
      flushBullets();
      flushPara();
      result.push({ type: "hr" });
    } else if (line === "") {
      flushBullets();
      flushPara();
    } else {
      flushBullets();
      para.push(line);
    }
  }
  flushBullets();
  flushPara();
  return result;
}

function renderInline(text: string): React.ReactNode {
  // **굵게** 처리. 분할된 토큰을 번갈아 평문/볼드로 렌더.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    }
    return <span key={i}>{p}</span>;
  });
}

export function LegalContent({ markdown }: { markdown: string }) {
  const blocks = parse(markdown);
  return (
    <div className="space-y-5 text-sm md:text-base text-textPrimary leading-relaxed">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2
                key={i}
                className="font-pixel text-lg md:text-xl text-deepGreen pt-6 first:pt-0"
              >
                {renderInline(b.text)}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                className="font-bold text-base text-textPrimary pt-2"
              >
                {renderInline(b.text)}
              </h3>
            );
          case "p":
            return (
              <p key={i}>
                {renderInline(b.text)}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="list-disc pl-5 space-y-1.5">
                {b.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case "hr":
            return <hr key={i} className="border-border my-6" />;
        }
      })}
    </div>
  );
}
