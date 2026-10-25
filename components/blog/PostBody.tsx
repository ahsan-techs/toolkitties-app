import type { Block } from "@/lib/blog";
import Inline from "./Inline";

export default function PostBody({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (typeof b === "string") return <p key={i}><Inline text={b} /></p>;
        if ("steps" in b)
          return (
            <ol key={i} className="bl-steps">
              {b.steps.map((s, j) => (
                <li key={j}><Inline text={s} /></li>
              ))}
            </ol>
          );
        if ("list" in b)
          return (
            <ul key={i} className="bl-list">
              {b.list.map((s, j) => (
                <li key={j}><Inline text={s} /></li>
              ))}
            </ul>
          );
        if ("note" in b)
          return (
            <aside key={i} className="bl-note" role="note">
              <span aria-hidden="true" className="bl-note-icon">💡</span>
              <p><Inline text={b.note} /></p>
            </aside>
          );
        return (
          <div key={i} className="bl-table-wrap" tabIndex={0} role="region" aria-label="Table">
            <table className="bl-table">
              <thead>
                <tr>{b.table.head.map((h, j) => <th key={j} scope="col">{h}</th>)}</tr>
              </thead>
              <tbody>
                {b.table.rows.map((r, j) => (
                  <tr key={j}>
                    {r.map((c, k) => (k === 0 ? <th key={k} scope="row"><Inline text={c} /></th> : <td key={k}><Inline text={c} /></td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}
