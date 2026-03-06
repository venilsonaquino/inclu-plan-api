export interface SemanticContextProps {
  strategyOverride?: string;
  theme: string;
  objective: string;
  description: string;
  studentData: {
    grade: string;
    profile: string;
    adaptation: string;
  };
  typeIdentifier: string;
  contextDescription: string;
}

export class SemanticContext {
  private readonly _hash: string;
  private readonly _semanticString: string;

  constructor(props: SemanticContextProps) {
    const hashParts = [
      props.strategyOverride,
      props.theme,
      props.studentData.grade,
      props.studentData.profile,
      props.typeIdentifier,
    ];

    const textParts = [
      `Objetivo: ${props.objective}`,
      `Descrição: ${props.description}`,
      props.strategyOverride
        ? `Estratégia Substituta: ${props.strategyOverride}`
        : null,
      `Adaptação: ${props.studentData.adaptation}`,
      `Contexto: ${props.contextDescription}`,
    ];

    this._hash = hashParts.filter(Boolean).join('-');
    this._semanticString = textParts.filter(Boolean).join('. ') + '.';
  }

  get hash(): string {
    return this._hash;
  }

  get semanticString(): string {
    return this._semanticString;
  }
}
