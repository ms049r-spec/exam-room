import React from 'react';

/**
 * Normalizes and formats mathematical and chemical notation:
 * - Automatically converts raw programming tokens (K_p -> Kₚ, K_c -> K𝑐, Q_c -> Q𝑐, P_i -> Pᵢ, etc.)
 * - Subscripts with underscores: e.g. _{...} -> <sub>...</sub>
 * - Superscripts with carets: e.g. ^{...} or ^2 -> <sup>...</sup>
 * - Preserves chemical formulas (CCl₄, CaCO₃, CO₂, etc.) intact without separation
 * - Line breaks (\n) -> preserved with <br />
 */
export function formatMathText(text: string | null | undefined): React.ReactNode {
  if (!text) return text ?? '';

  // Normalize mathematical and chemical notation into proper symbols
  const cleaned = text
    // Equilibrium constants & reaction quotients
    .replace(/\b(K_p|Kp)\b/g, 'Kₚ')
    .replace(/\b(K_c|Kc)(?=RT|\b)/g, 'K𝑐')
    .replace(/\b(K_x|Kx)\b/g, 'Kₓ')
    .replace(/\b(Q_c|Qc)\b/g, 'Q𝑐')
    .replace(/\b(Q_p|Qp)\b/g, 'Qₚ')
    .replace(/\b(P_i|Pᵢ)\b/g, 'Pᵢ')
    .replace(/\bx_i\b/g, 'xᵢ')
    .replace(/\b(alpha\^2|α\^2|alpha²)\b/g, 'α²')
    // Equation terms: (RT) raised exponents like (RT)^Δn, (RT)Δn, (RT)⁻Δn, (RT)^0, etc.
    .replace(/\(RT\)[\^]?[\-−\u207B]?Δn/g, (match) => {
      const isNeg = match.includes('-') || match.includes('−') || match.includes('\u207B');
      return isNeg ? '(RT)^{−Δn}' : '(RT)^{Δn}';
    })
    .replace(/\(RT\)[\^]?[0\u2070]/g, '(RT)^{0}')
    .replace(/\(RT\)[\^]?[1\u00B9]/g, '(RT)^{1}')
    .replace(/\(RT\)[\^]?[2\u00B2]/g, '(RT)^{2}')
    .replace(/\^([0-9+\-−Δn]+)/g, '^{$1}')
    // Chemical formulas
    .replace(/\bH_2\b/g, 'H₂')
    .replace(/\bI_2\b/g, 'I₂')
    .replace(/\bN_2O_4\b/g, 'N₂O₄')
    .replace(/\bNO_2\b/g, 'NO₂')
    .replace(/\bNH_3\b/g, 'NH₃')
    .replace(/\bSO_2\b/g, 'SO₂')
    .replace(/\bSO_3\b/g, 'SO₃')
    .replace(/\bCO_2\b/g, 'CO₂')
    .replace(/\bCaCO_3\b/g, 'CaCO₃');

  if (!cleaned.includes('_') && !cleaned.includes('^') && !cleaned.includes('\n')) {
    return cleaned;
  }

  const lines = cleaned.split('\n');

  return lines.map((line, lineIdx) => {
    const parts: React.ReactNode[] = [];
    const regex = /(_\{([^}]+)\}|_([A-Za-z0-9]+)|\^\{([^}]+)\}|\^([A-Za-z0-9+\-−Δ]+))/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }

      if (match[1].startsWith('_')) {
        const subContent = match[2] || match[3];
        parts.push(
          <sub key={`sub-${lineIdx}-${match.index}`} className="text-[0.78em] leading-none align-sub font-medium">
            {subContent}
          </sub>
        );
      } else if (match[1].startsWith('^')) {
        const supContent = match[4] || match[5];
        parts.push(
          <sup key={`sup-${lineIdx}-${match.index}`} className="text-[0.78em] leading-none align-super font-medium">
            {supContent}
          </sup>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    return (
      <React.Fragment key={lineIdx}>
        {parts}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}
